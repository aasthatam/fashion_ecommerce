import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, required: true}, 
    price: { type: Number, required: true },
    images: { type: Array, required: true }, 
    category: { type: String, required: true },
    fabric: { type: String },
    suitableBodyType: {
        type: [String],
        enum: ["rectangle", "triangle", "inverted triangle", "spoon", "hourglass"],
        required: true,
    },
    bestselling: { type: Boolean },
    isNewArrival: { type: Boolean },
    tags: { type: [String], default: [] },
    availability: { type: String, default: "In Stock" },
    colors: { type: String }, 
    sizes: { type: Array, required: true }, 
    createdAt: { type: Date, default: Date.now }
    


})
const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel;