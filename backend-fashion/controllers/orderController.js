import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import userBehaviorModel from "../models/userBehaviorModel.js";

// Place order using COP method
const placeOrder = async (req, res) => {
    try{
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Log user purchase behavior
            for (const item of items) {
                await userBehaviorModel.create({
                userId,
                productId: item._id,
                action: "purchase",
                size: item.size
                });
            }

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({ success: true, message: "Order Placed"})
        // Send confirmation email
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
                <p style="font-size: 18px; color: #777; margin: 0;">Order Confirmation (Cash on Delivery)</p>
                </div>

                <p>Hi ${address.firstName},</p>
                <p>Thank you for placing your order with <strong>WearNova</strong>.</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr>
                    <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Item</th>
                    <th style="text-align: center; border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
                    <th style="text-align: right; border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">$${item.price}</td>
                    </tr>
                    `).join("")}
                </tbody>
                </table>

                <p style="margin-top: 20px; font-size: 16px;">
                <strong>Total Amount: $${amount}</strong><br/>
                <strong>Payment Method:</strong> Cash on Delivery
                </p>

                <p style="margin-top: 30px;">We'll notify you once your items are on their way.</p>
                <p style="color: #777;">Thank you for shopping with us!<br>— The WearNova Team</p>
            </div>
            `;
  
      await transporter.sendMail({
        from: `"WearNova" <${process.env.GMAIL_USER}>`,
        to: address.email,
        subject: "Order Confirmation (Cash on Delivery)",
        html: emailBody,
      });
  
      console.log("COD confirmation email sent");
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.messsage })
        
    }

}


// All orders data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, orders})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }

}

// User orders data for Admin panel
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.messsage })

    }
    
}

// update order status from Admin Panel 
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success: true, message: 'Status Updated'})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
    
}

const cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.body;
      const order = await orderModel.findById(orderId);
  
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }
  
      if (order.status !== "Order Placed" && order.status !== "Packing") {
        return res.json({ success: false, message: "Cannot cancel at this stage" });
      }
  
      order.status = "Cancelled";
      await order.save();
  
      res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  

export { placeOrder, allOrders, userOrders, updateStatus, cancelOrder };