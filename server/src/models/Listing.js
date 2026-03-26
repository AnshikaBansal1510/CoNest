import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Basic details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  rent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },

  // Location
  address: {
    street: { type: String },
    area:   { type: String, required: true },
    city:   { type: String, required: true },
    pincode:{ type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    }
  },

  // Flat details
  bhk: {
    type: Number,
    required: true
  },
  furnishing: {
    type: String,
    enum: ['unfurnished', 'semi_furnished', 'fully_furnished'],
    default: 'semi_furnished'
  },
  availableFrom: {
    type: Date,
    required: true
  },
  preferredFor: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any'
  },

  // Amenities
  amenities: [{
    type: String,
    enum: [
      'wifi', 'ac', 'gym', 'parking',
      'laundry', 'security', 'lift',
      'power_backup', 'gated_society'
    ]
  }],

  // Photos
  photos: [{ type: String }],

  // Rules
  rules: {
    petsAllowed:    { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    guestsAllowed:  { type: Boolean, default: true },
  },

  status: {
    type: String,
    enum: ['active', 'filled', 'paused'],
    default: 'active'
  },

  viewCount: {
    type: Number,
    default: 0
  },

}, { timestamps: true });


// 🔍 Text search index
listingSchema.index({
  title: 'text',
  'address.area': 'text',
  'address.city': 'text'
});


const Listing = mongoose.model('Listing', listingSchema);

export default Listing;