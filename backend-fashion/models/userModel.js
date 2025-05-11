import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    cartData: { type: Object, default: {}
    },
    wishlistData: { type: Array, default: [] }, 
    bodyShape: { type: String, default: "" },
    recentSearches: {
        type: [String],
        default: []
      },
    notifications: [
        {
          productId: { type: String },
          message: { type: String },
          createdAt: { type: Date, default: Date.now },
          read: { type: Boolean, default: false }
        }
    ]  
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;

