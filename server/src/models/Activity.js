import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    recipientId: { type: String, required: true },  // clerkId of who sees it
    text: { type: String, required: true },
    icon: { type: String, default: "✨" },
  },
  { timestamps: true }
);

activitySchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);