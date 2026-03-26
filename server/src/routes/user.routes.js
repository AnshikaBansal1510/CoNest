import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import User from '../models/User.js';

const router = express.Router();


// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -savedListings');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({ user });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, bio, role } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (bio) updates.bio = bio;
    if (role) updates.role = role;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ message: 'Profile updated', user });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// PUT /api/users/preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const allowedFields = [
      'sleepSchedule', 'cleanliness', 'noiseTolerance', 'guestPolicy',
      'smoking', 'drinking', 'pets', 'cooking',
      'budget', 'preferredArea', 'moveInDate', 'occupation', 'gender', 'preferredGender'
    ];

    const prefs = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        prefs[`preferences.${field}`] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: prefs },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preferences updated',
      preferences: user.preferences
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// POST /api/users/avatar
router.post('/avatar', protect, (req, res) => {
  uploadAvatar(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: err.message });

    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    );

    res.json({
      message: 'Avatar updated',
      avatar: user.avatar
    });
  });
});


// POST /api/users/save/:listingId
router.post('/save/:listingId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;

    const idx = user.savedListings.indexOf(listingId);

    if (idx === -1) {
      user.savedListings.push(listingId);
    } else {
      user.savedListings.splice(idx, 1);
    }

    await user.save();

    const saved = idx === -1;

    res.json({
      message: saved ? 'Listing saved' : 'Listing unsaved',
      saved
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/users/saved/listings
router.get('/saved/listings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedListings');

    res.json({ listings: user.savedListings });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;

