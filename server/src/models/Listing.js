import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true },   // owner
    title: { type: String, required: true },
    city: { type: String, required: true },
    rent: { type: Number, required: true },
    views: { type: Number, default: 0 },
    sponsored: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);