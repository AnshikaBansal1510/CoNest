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
// Mock Database for development corresponding to SearchPage.jsx mock IDs
const MOCK_USERS = {
  "1": { name: "Priya K.", city: "Bangalore", occupation: "IT Professional", bio: "Clean and organized. Looking for a friendly flatmate.", budget: 15000, avatar: "PK", lifestyle: ["Vegetarian", "Office goer", "Early riser"], genderPref: "Female", verification: { email: true, phone: true, govId: true, selfie: true }, completionPercent: 100 },
  "2": { name: "Ravi M.", city: "Mumbai", occupation: "Finance", bio: "I work long hours. Keep to myself mostly but happy to hang out.", budget: 25000, avatar: "RM", lifestyle: ["Non-veg", "Office goer", "Night owl"], genderPref: "Any", verification: { email: true, phone: true, govId: true, selfie: false }, completionPercent: 85 },
  "3": { name: "Sneha T.", city: "Delhi", occupation: "Student", bio: "I love reading and quiet environments.", budget: 10000, avatar: "ST", lifestyle: ["Vegetarian", "Introvert", "Student"], genderPref: "Female", verification: { email: true, phone: false, govId: false, selfie: false }, completionPercent: 40 },
  "4": { name: "Aarav P.", city: "Pune", occupation: "Student", bio: "Just moved to the city. Excited to explore!", budget: 8500, avatar: "AP", lifestyle: ["Gym lover", "Social", "Non-smoker"], genderPref: "Male", verification: { email: true, phone: true, govId: true, selfie: true }, completionPercent: 100 },
  "5": { name: "Nisha R.", city: "Bangalore", occupation: "Any", bio: "Looking for an upscale place with amenities.", budget: 20000, avatar: "NR", lifestyle: ["Pet lover", "WFH", "Social"], genderPref: "Any", verification: { email: true, phone: true, govId: true, selfie: true }, completionPercent: 100 },
  "6": { name: "Karan V.", city: "Pune", occupation: "IT Professional", bio: "Need a calm place close to work.", budget: 7000, avatar: "KV", lifestyle: ["Smoker", "Night owl"], genderPref: "Male", verification: { email: true, phone: false, govId: false, selfie: false }, completionPercent: 30 }
};

// GET /api/users/:id
// Returns a specific user's public profile data as JSON
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Handle mock IDs directly matching the SearchPage UI (e.g. "1" - "6")
    if (MOCK_USERS[id]) {
       return res.json(MOCK_USERS[id]);
    }

    let user;
    if (id.length === 24) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ clerkId: id });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      name:       user.name,
      age:        user.age ?? "",
      city:       user.city,
      occupation: user.occupation,
      budget:     user.budget ? String(user.budget) : "",
      bio:        user.bio,
      avatar:     user.avatar,

      lifestyle:  user.tags,
      genderPref: user.genderPref,

      verification: {
        email:   user.emailVerified,
        phone:   user.phoneVerified,
        govId:   user.govIdVerified,
        selfie:  user.selfieVerified,
      },

      completionPercent: calcCompletion(user),
    });
  } catch (err) {
    console.error("GET /users/:id error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Helper Function
function calcCompletion(user) {
  const checks = [
    !!(user.name && user.email),    
    user.hasPreferences,            
    user.hasPhotos,                 
    user.verified,                  
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default router;