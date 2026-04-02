import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    // The two users in this match
    userA: { type: String, required: true },   // clerkId
    userB: { type: String, required: true },   // clerkId

    score: { type: Number, required: true },   // 0–100 compatibility score
  },
  { timestamps: true }
);

// Index so we can quickly look up all matches for a user
matchSchema.index({ userA: 1 });
matchSchema.index({ userB: 1 });

export default mongoose.model("Match", matchSchema);