import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { computeCompatibility } from '../utils/compatibility.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

const router = express.Router();


// GET /api/match/roommates
router.get('/roommates', protect, async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const minScore = parseInt(req.query.minScore) || 40;

    const currentUser = await User.findById(req.user._id);

    if (!currentUser.preferences) {
      return res.status(400).json({
        message: 'Please complete your preferences first to get matches.'
      });
    }

    const candidates = await User.find({
      _id: { $ne: req.user._id },
      role: { $in: ['seeker', 'both'] },
    }).select('name avatar bio preferences occupation');

    const results = candidates
      .map(candidate => {
        const { score, breakdown, label } = computeCompatibility(
          currentUser.preferences,
          candidate.preferences
        );

        return {
          user: {
            _id: candidate._id,
            name: candidate.name,
            avatar: candidate.avatar,
            bio: candidate.bio,
            occupation: candidate.preferences?.occupation,
            area: candidate.preferences?.preferredArea,
            budget: candidate.preferences?.budget,
            gender: candidate.preferences?.gender,
            moveInDate: candidate.preferences?.moveInDate,
          },
          score,
          breakdown,
          label,
        };
      })
      .filter(r => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.json({ matches: results, total: results.length });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/match/score/:userId
router.get('/score/:userId', protect, async (req, res) => {
  try {
    const [currentUser, targetUser] = await Promise.all([
      User.findById(req.user._id),
      User.findById(req.params.userId).select('name avatar preferences'),
    ]);

    if (!targetUser)
      return res.status(404).json({ message: 'User not found' });

    const result = computeCompatibility(
      currentUser.preferences,
      targetUser.preferences
    );

    res.json({
      with: {
        _id: targetUser._id,
        name: targetUser.name,
        avatar: targetUser.avatar
      },
      ...result,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/match/listings
router.get('/listings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const prefs = user.preferences || {};

    const filter = { status: 'active' };

    if (prefs.preferredArea)
      filter['address.area'] = new RegExp(prefs.preferredArea, 'i');

    if (prefs.budget)
      filter.rent = { $lte: prefs.budget };

    if (prefs.gender && prefs.gender !== 'any') {
      filter.preferredFor = { $in: [prefs.gender, 'any'] };
    }

    const listings = await Listing.find(filter)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    const scored = listings.map(listing => {
      let score = 50;

      if (prefs.budget && listing.rent <= prefs.budget) score += 20;
      if (prefs.pets !== undefined && listing.rules?.petsAllowed === prefs.pets) score += 10;
      if (prefs.smoking !== undefined && listing.rules?.smokingAllowed === prefs.smoking) score += 10;
      if (
        prefs.preferredArea &&
        listing.address?.area?.toLowerCase().includes(prefs.preferredArea.toLowerCase())
      ) score += 10;

      return {
        listing,
        matchScore: Math.min(100, score),
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ listings: scored });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;