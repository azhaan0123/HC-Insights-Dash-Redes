import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["Patient", "Lead", "Employer"], required: true },
    channel: { type: String, enum: ["Email", "SMS", "Multi-Channel"], default: "Email" },
    status: { type: String, enum: ["Active", "Draft", "Completed", "Archived"], default: "Active" },
    audienceCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    deliveredCount: { type: Number, default: 0 },
    openedCount: { type: Number, default: 0 },
    clickedCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    attachments: [
      {
        name: String,
        size: String,
        fileType: String,
      },
    ],
  },
  { timestamps: true }
);

export const Campaign = mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
