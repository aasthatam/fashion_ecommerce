import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true }, 
    category: { type: String, required: true },
    fabric: { type: String },
    bestselling: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    code: { type: String, unique: true },
    availability: { type: String, default: "In Stock" },
    colors: { type: String }, 
    sizes: { type: Array, required: true }, 
    details: { type: String, required: true}, 
    createdAt: { type: Date, default: Date.now }


})
const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel;