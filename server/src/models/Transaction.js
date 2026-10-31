import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  type: { type: String, enum: ["income", "expense", "transfer"], required: true },
  amountPaise: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  currency: { type: String, default: "INR", enum: ["INR"] },
  category: { type: String, default: "Other", trim: true, maxlength: 60 },
  description: { type: String, trim: true, maxlength: 250, default: "" },
  transactionDate: { type: Date, required: true },
  source: { type: String, enum: ["manual", "csv"], default: "manual" }
}, { timestamps: true });

transactionSchema.index({ userId: 1, transactionDate: -1 });
export default mongoose.model("Transaction", transactionSchema);
