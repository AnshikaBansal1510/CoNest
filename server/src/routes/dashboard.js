import express from "express";
import { requireAuth } from "../middlewares/clerkAuth.js";
import User from "../models/User.js";
import Match from "../models/Match.js";
import Listing from "../models/Listing.js";
import Activity from "../models/Activity.js";
import Message from "../models/Message.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    // ── 1. Fetch the current user ────────────────────────────
    let currentUser = await User.findOne({ clerkId: userId });

    if (!currentUser) {
      return res.status(200).json({
        user: {
          name: "Loading...",
          avatar: "??",
        },
        stats: {
          profileViews: 0,
          totalMatches: 0,
          messages: 0,
          unreadMessages: 0,
          listingViews: 0,
        },
        topMatches: [],
        recentActivity: [],
        profileCompletion: {
          basicInfo: false,
          preferences: false,
          photos: false,
          verification: false,
        },
        completionPercent: 0,
      });
    }

    // ── 2. Stats ─────────────────────────────────────────────

    // Total matches (rows where user is userA or userB)
    const totalMatches = await Match.countDocuments({
      $or: [{ userA: userId }, { userB: userId }],
    });

    // Unread messages where user is the recipient
    const unreadMessages = await Message.countDocuments({
      recipientId: userId,
      read: false,
    });

    // Total messages (conversations)
    const totalMessages = await Message.countDocuments({
      $or: [{ senderId: userId }, { recipientId: userId }],
    });

    // Listing views (sum across all user's listings)
    const listingStats = await Listing.aggregate([
      { $match: { clerkId: userId } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const listingViews = listingStats[0]?.totalViews ?? 0;

    const stats = {
      profileViews: currentUser.profileViews,
      totalMatches,
      messages: totalMessages,
      unreadMessages,
      listingViews,
    };

    // ── 3. Top Matches (up to 4) ──────────────────────────────
    const matchDocs = await Match.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .sort({ score: -1 })
      .limit(4);

    // Get the other user's clerkId from each match
    const matchedUserIds = matchDocs.map((m) =>
      m.userA === userId ? m.userB : m.userA
    );

    const matchedUsers = await User.find({ clerkId: { $in: matchedUserIds } });

    // Build a lookup map for quick access
    const userMap = {};
    matchedUsers.forEach((u) => (userMap[u.clerkId] = u));

    const topMatches = matchDocs.map((m) => {
      const otherId = m.userA === userId ? m.userB : m.userA;
      const other = userMap[otherId];
      return {
        id: m._id,
        name: other?.name ?? "Unknown",
        city: other?.city ?? "—",
        budget: other?.budget ? `₹${other.budget.toLocaleString("en-IN")}` : "—",
        score: m.score,
        tags: other?.tags ?? [],
        avatar: other?.avatar ?? "??",
        verified: other?.verified ?? false,
      };
    });

    // ── 4. Recent Activity (latest 5) ────────────────────────
    const activityDocs = await Activity.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = activityDocs.map((a) => ({
      text: a.text,
      icon: a.icon,
      time: timeAgo(a.createdAt),
    }));

    // ── 5. Profile completion ─────────────────────────────────
    const profileCompletion = {
      basicInfo: !!(currentUser.name && currentUser.email),
      preferences: currentUser.hasPreferences,
      photos: currentUser.hasPhotos,
      verification: currentUser.verified,
    };

    const completedCount = Object.values(profileCompletion).filter(Boolean).length;
    const completionPercent = Math.round((completedCount / 4) * 100);

    // ── 6. Send it all ───────────────────────────────────────
    res.json({
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      stats,
      topMatches,
      recentActivity,
      profileCompletion,
      completionPercent,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// ── Helper: human-readable time ───────────────────────────────
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default router;