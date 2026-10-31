import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  targetPaise: { type: Number, required: true, min: 1 },
  currentPaise: { type: Number, default: 0, min: 0 },
  targetDate: { type: Date },
  category: { type: String, default: "General" },
  status: { type: String, enum: ["active", "completed", "paused"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Goal", goalSchema);
