import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadListingPhotos, cloudinary } from '../middlewares/upload.middleware.js';
import Listing from '../models/Listing.js';

const router = express.Router();


// GET /api/listings
router.get('/', async (req, res) => {
  try {
    const { city, area, minRent, maxRent, bhk, furnishing, preferredFor, amenities, search } = req.query;

    const filter = { status: 'active' };

    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (area) filter['address.area'] = new RegExp(area, 'i');
    if (bhk) filter.bhk = Number(bhk);
    if (furnishing) filter.furnishing = furnishing;
    if (preferredFor) filter.preferredFor = { $in: [preferredFor, 'any'] };

    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    if (amenities) filter.amenities = { $all: amenities.split(',') };
    if (search) filter.$text = { $search: search };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('owner', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Listing.countDocuments(filter),
    ]);

    res.json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET single listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name avatar phone email');

    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });

    listing.viewCount += 1;
    await listing.save();

    res.json({ listing });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// CREATE listing
router.post('/', protect, (req, res) => {
  uploadListingPhotos(req, res, async (err) => {
    if (err)
      return res.status(400).json({ message: err.message });

    try {
      const photoUrls = (req.files || []).map(f => f.path);

      const {
        title, description, rent, deposit, bhk, furnishing,
        availableFrom, preferredFor, amenities, rules,
        street, area, city, pincode, lat, lng
      } = req.body;

      const listing = await Listing.create({
        owner: req.user._id,
        title,
        description,
        rent: Number(rent),
        deposit: deposit ? Number(deposit) : 0,
        bhk: Number(bhk),
        furnishing,
        availableFrom,
        preferredFor,
        amenities: amenities ? JSON.parse(amenities) : [],
        rules: rules ? JSON.parse(rules) : {},
        address: {
          street,
          area,
          city,
          pincode,
          coordinates: {
            lat: Number(lat),
            lng: Number(lng)
          }
        },
        photos: photoUrls,
      });

      res.status(201).json({ message: 'Listing created', listing });

    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
});


// UPDATE listing
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });

    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const allowedUpdates = [
      'title', 'description', 'rent', 'deposit',
      'furnishing', 'availableFrom', 'preferredFor',
      'amenities', 'rules', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined)
        listing[field] = req.body[field];
    });

    await listing.save();

    res.json({ message: 'Listing updated', listing });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// DELETE listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing)
      return res.status(404).json({ message: 'Listing not found' });

    if (listing.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    for (const url of listing.photos) {
      const publicId = url.split('/').slice(-2).join('/').replace(/\.[^.]+$/, '');
      await cloudinary.uploader.destroy(publicId);
    }

    await listing.deleteOne();

    res.json({ message: 'Listing deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;