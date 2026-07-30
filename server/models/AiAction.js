import mongoose from "mongoose";

const aiActionSchema = new mongoose.Schema(
  {
    actionId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    suggestedAction: { type: String, required: true },
    agentType: { type: String, required: true },
    priority: { type: String, enum: ["critical", "high", "medium", "low"], default: "high" },
    confidence: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rejectionReason: { type: String },
    rejectionNote: { type: String },
    patientName: { type: String },
    patientMrn: { type: String },
  },
  { timestamps: true }
);

export const AiAction = mongoose.models.AiAction || mongoose.model("AiAction", aiActionSchema);
