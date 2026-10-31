import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  type: { type: String, enum: ["cash", "savings", "current", "credit", "investment", "other"], default: "savings" },
  openingBalancePaise: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: "INR", enum: ["INR"] }
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);
