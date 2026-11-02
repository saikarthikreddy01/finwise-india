import mongoose from "mongoose";

const financialProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  category: { type: String, enum: ["fixed_deposit", "savings", "mutual_fund", "bond", "insurance", "loan", "government_scheme"], required: true },
  description: { type: String, default: "" },
  indicativeRateMin: Number,
  indicativeRateMax: Number,
  sourceUrl: String,
  verifiedAt: Date,
  isStudentFocused: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("FinancialProduct", financialProductSchema);
