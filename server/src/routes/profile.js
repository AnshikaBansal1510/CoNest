import express from "express";
import { requireAuth } from "../middlewares/clerkAuth.js";
import User from "../models/User.js";

const router = express.Router();

// ── GET /api/profile ─────────────────────────────────────────
// Returns the current user's full profile
router.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found. Please sync." });
    }

    res.json({
      // Basic info tab
      name:       user.name,
      age:        user.age ?? "",
      city:       user.city,
      occupation: user.occupation,
      budget:     user.budget ? String(user.budget) : "",
      bio:        user.bio,
      avatar:     user.avatar,

      // Preferences tab
      lifestyle:  user.tags,
      genderPref: user.genderPref,

      // Verification tab
      verification: {
        email:   user.emailVerified,
        phone:   user.phoneVerified,
        govId:   user.govIdVerified,
        selfie:  user.selfieVerified,
      },

      // Completion badge
      completionPercent: calcCompletion(user),
    });
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ── PUT /api/profile/info ─────────────────────────────────────
// Saves basic info tab
router.put("/info", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, age, city, occupation, budget, bio } = req.body;

    // Rebuild avatar initials if name changed
    const avatar = name
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : undefined;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        ...(name        && { name }),
        ...(avatar      && { avatar }),
        ...(age         && { age: Number(age) }),
        ...(city        && { city }),
        ...(occupation  && { occupation }),
        ...(budget      && { budget: Number(budget) }),
        ...(bio !== undefined && { bio }),
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      completionPercent: calcCompletion(user),
    });
  } catch (err) {
    console.error("PUT /profile/info error:", err);
    res.status(500).json({ error: "Failed to save basic info" });
  }
});

// ── PUT /api/profile/preferences ─────────────────────────────
// Saves preferences tab (lifestyle tags + gender pref)
router.put("/preferences", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { lifestyle, genderPref } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        tags:           lifestyle ?? [],
        genderPref:     genderPref ?? "Any",
        hasPreferences: true,           // mark completion flag
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      success: true,
      completionPercent: calcCompletion(user),
    });
  } catch (err) {
    console.error("PUT /profile/preferences error:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// ── POST /api/profile/verify/:type ───────────────────────────
// Triggers a verification step (email, phone, govId, selfie)
// In production you'd kick off a real flow here (OTP, doc upload, etc.)
// For now it just marks the field as verified so you can wire in real logic later.
router.post("/verify/:type", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { type } = req.params;

    const fieldMap = {
      email:  "emailVerified",
      phone:  "phoneVerified",
      govId:  "govIdVerified",
      selfie: "selfieVerified",
    };

    const field = fieldMap[type];
    if (!field) {
      return res.status(400).json({ error: "Unknown verification type" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { [field]: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    // If all four are done, mark user as fully verified
    if (
      user.emailVerified &&
      user.phoneVerified &&
      user.govIdVerified &&
      user.selfieVerified
    ) {
      await User.findOneAndUpdate({ clerkId: userId }, { verified: true });
    }

    res.json({ success: true, completionPercent: calcCompletion(user) });
  } catch (err) {
    console.error("POST /profile/verify error:", err);
    res.status(500).json({ error: "Failed to update verification" });
  }
});

// ── Helper ────────────────────────────────────────────────────
function calcCompletion(user) {
  const checks = [
    !!(user.name && user.email),    // basic info
    user.hasPreferences,            // preferences saved at least once
    user.hasPhotos,                 // photo uploaded
    user.verified,                  // fully verified
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default router;