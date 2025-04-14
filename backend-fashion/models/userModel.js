import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cartData: { type: Object, default: {}
        // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        // quantity: { type: Number, required: true, default: 1 },
        // price: { type: Number, required: true }, // You can store the price at the time of adding to cart.
        // addedAt: { type: Date, default: Date.now }
    },
    // cartTotal: { type: Number, default: 0 } // Optional, you can update it on each cart change.
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;

