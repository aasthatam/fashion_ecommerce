import express from 'express'
import { placeOrder, allOrders, userOrders, updateStatus, cancelOrder } from "../controllers/orderController.js"
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { createPayment, executePayment } from "../controllers/paypalController.js"

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser, placeOrder)

// User Feature
orderRouter.post('/userorders', authUser, userOrders )

orderRouter.post('/paypal/create', authUser, createPayment);
orderRouter.post('/paypal/execute', authUser, executePayment);

orderRouter.post('/cancel', authUser, cancelOrder);

export default orderRouter