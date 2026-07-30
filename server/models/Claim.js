import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    cptCode: { type: String, required: true },
    description: { type: String, required: true },
    dateOfService: { type: String, required: true },
    rateCharged: { type: Number, required: true },
    category: { type: String, required: true }, // e.g. "Primary Care", "Specialty", "ER Visit"
    status: { type: String, enum: ["Paid", "Pending", "Denied"], default: "Paid" },
  },
  { timestamps: true }
);

export const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);
