import mongoose from "mongoose";

const encounterSchema = new mongoose.Schema(
  {
    encounterId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    type: { type: String, required: true }, // e.g. "DPC Annual Wellness Exam", "Routine Follow-up"
    date: { type: String, required: true },
    provider: { type: String, required: true },
    isAfterHours: { type: Boolean, default: false },
    copayAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Completed", "Scheduled", "Cancelled"], default: "Completed" },
  },
  { timestamps: true }
);

export const Encounter = mongoose.models.Encounter || mongoose.model("Encounter", encounterSchema);
