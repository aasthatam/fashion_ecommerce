import mongoose from "mongoose";

const userBehaviorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
  action: { type: String, enum: ["view", "wishlist", "wishlist remove", "cart", "cart remove"], required: true },
  size: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const userBehaviorModel = mongoose.models.userbehavior || mongoose.model("userbehavior", userBehaviorSchema);
export default userBehaviorModel;
