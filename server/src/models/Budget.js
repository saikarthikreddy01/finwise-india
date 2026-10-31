import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  category: { type: String, required: true, trim: true },
  limitPaise: { type: Number, required: true, min: 1 },
  month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },
  currency: { type: String, default: "INR", enum: ["INR"] }
}, { timestamps: true });

budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });
export default mongoose.model("Budget", budgetSchema);
