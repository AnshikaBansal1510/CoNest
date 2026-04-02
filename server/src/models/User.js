import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId:        { type: String, required: true, unique: true },
    name:           { type: String, required: true },
    email:          { type: String, required: true },
    age:            { type: Number, default: null },
    city:           { type: String, default: "" },
    occupation:     { type: String, default: "" },
    bio:            { type: String, default: "" },
    budget:         { type: Number, default: 0 },
    tags:           { type: [String], default: [] },      // lifestyle tags
    genderPref:     { type: String, default: "Any" },     // "Any" | "Male" | "Female"
    avatar:         { type: String, default: "" },
    verified:       { type: Boolean, default: false },
    profileViews:   { type: Number, default: 0 },

    // Verification sub-statuses
    emailVerified:  { type: Boolean, default: false },
    phoneVerified:  { type: Boolean, default: false },
    govIdVerified:  { type: Boolean, default: false },
    selfieVerified: { type: Boolean, default: false },

    // Profile completion flags
    hasPhotos:      { type: Boolean, default: false },
    hasPreferences: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);