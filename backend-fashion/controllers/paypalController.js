import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"; 

dotenv.config();

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Step 1: Create Payment
export const createPayment = (req, res) => {
  const { total } = req.body;
  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    },
    transactions: [{
      amount: { currency: "USD", total: total.toFixed(2) },
      description: "Fashion Order",
    }],
  };

  paypal.payment.create(create_payment_json, (err, payment) => {
    if (err) {
      console.error("PayPal payment creation error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    const approvalUrl = payment.links.find(link => link.rel === "approval_url")?.href;
    res.json({ success: true, approvalUrl });
  });
};

// Step 2: Execute Payment + Save Order + Send Email
export const executePayment = async (req, res) => {
  const { paymentId, PayerID, userId, items, amount, address, email, paymentMethod } = req.body;

  paypal.payment.execute(paymentId, { payer_id: PayerID }, async (err, payment) => {
    if (err) {
      console.error("PayPal execution error:", err.response || err.message || err);
      return res.status(500).json({ success: false, message: err.message || "PayPal error" });
    }

    const paypalPaymentId = payment?.id;
    if (!paypalPaymentId) {
      console.error("Missing PayPal payment ID");
      return res.status(400).json({ success: false, message: "Invalid PayPal ID" });
    }

    try {
      const existingOrder = await orderModel.findOne({ paymentId: paypalPaymentId });
      if (existingOrder) {
        console.log("Duplicate order detected, skipping...");
        return res.json({ success: true, message: "Order already exists" });
      }

      const formattedItems = items.map(item => ({
        ...item,
        images: item.images || ["/placeholder.jpg"],
        status: "Order Placed"
      }));

      const newOrder = new orderModel({
        userId,
        items: formattedItems,
        amount,
        address,
        paymentMethod,
        paymentId: paypalPaymentId,
        payment: true,
        date: Date.now()
      });

      const savedOrder = await newOrder.save();
      console.log("Order saved with ID:", savedOrder._id);

      await userModel.updateOne(
        { _id: userId },
        { $set: { cartData: {} } }
      );
      console.log("Cart cleared from user data");

      // Respond first to avoid frontend hang
      res.json({ success: true, message: "Order placed successfully" });

      // Send email asynchronously
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #222; margin: 0;">WearNova</h1>
          <p style="font-size: 18px; color: #777; margin: 0;">Order Confirmation</p>
        </div>
    
        <p>Hi there! Thank you for shopping with <strong>WearNova</strong>.</p>
        <p>Here are your order details:</p>
    
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Item</th>
              <th style="text-align: center; border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
              <th style="text-align: right; border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${formattedItems.map(item => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">$${item.price}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
    
        <p style="margin-top: 20px; font-size: 16px;"><strong>Total Paid: $${amount}</strong></p>
    
        <p style="margin-top: 30px;">We’ll notify you once your items are on their way.</p>
        <p style="color: #777;">Thank you for shopping with us!<br>— The WearNova Team</p>
      </div>
    `;

      transporter.sendMail({
        from: `"WearNova" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your Order Confirmation",
        html: emailBody
      }).then(() => {
        console.log("Email sent successfully");
      }).catch((emailErr) => {
        console.error("Failed to send email:", emailErr.message);
      });

    } catch (e) {
      console.error("Order creation error:", e);
      return res.status(500).json({ success: false, message: e.message });
    }
  });
};
