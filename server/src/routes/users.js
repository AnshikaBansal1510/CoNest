import express from "express";
import { requireAuth } from "../middlewares/clerkAuth.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users/sync
// Called from the frontend after every login to ensure user exists in DB
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, email } = req.body;

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        name,
        email,
        // avatar initials from name
        avatar: name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

export default router;