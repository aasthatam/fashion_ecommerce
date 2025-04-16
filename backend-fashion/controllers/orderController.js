import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

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

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({ success: true, message: "Order Placed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.messsage })
        
    }

}


// All orders data for Admin panel
const allOrders = async (req, res) => {

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
    
}

export { placeOrder, allOrders, userOrders, updateStatus }