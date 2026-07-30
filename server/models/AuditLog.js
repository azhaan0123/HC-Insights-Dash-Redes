import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    auditId: { type: String, required: true, unique: true },
    actionType: { type: String, required: true },
    workflow: { type: String, required: true },
    inputRef: { type: String },
    modelVersion: { type: String, default: "helix-v2.4.1" },
    rawOutput: { type: String },
    finalOutput: { type: String },
    confidence: { type: Number, default: 90 },
    confidenceTier: { type: String, default: "high" },
    riskTier: { type: String, default: "medium" },
    status: { type: String, required: true },
    reviewerId: { type: String, default: "current-user" },
    reviewerReason: { type: String },
    reviewerNote: { type: String },
    decidedAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
