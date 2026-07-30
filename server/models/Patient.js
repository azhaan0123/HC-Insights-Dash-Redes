import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    mrn: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    employer: { type: String, required: true },
    riskScore: { type: Number, required: true },
    classification: { type: String, enum: ["Proactive", "Reactive"], default: "Proactive" },
    awvStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    status: { type: String, enum: ["Open", "Confirmed", "Deferred", "Rejected", "N/A"], default: "Open" },
    phone: { type: String },
    email: { type: String },
    conditions: [{ type: String }],
    lastVisit: { type: String },
  },
  { timestamps: true }
);

export const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
