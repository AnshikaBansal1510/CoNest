import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const preferenceSchema = new mongoose.Schema({
  sleepSchedule:   { type: String, enum: ['early_bird', 'night_owl', 'flexible'], default: 'flexible' },
  cleanliness:     { type: Number, min: 1, max: 5, default: 3 },
  noiseTolerance:  { type: String, enum: ['quiet', 'moderate', 'loud_ok'], default: 'moderate' },
  guestPolicy:     { type: String, enum: ['no_guests', 'occasional', 'frequent_ok'], default: 'occasional' },

  smoking:         { type: Boolean, default: false },
  drinking:        { type: Boolean, default: false },
  pets:            { type: Boolean, default: false },
  cooking:         { type: String, enum: ['rarely', 'sometimes', 'often'], default: 'sometimes' },

  budget:          { type: Number },
  preferredArea:   { type: String },
  moveInDate:      { type: Date },
  occupation:      { type: String, enum: ['student', 'working_professional', 'other'], default: 'other' },
  gender:          { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  preferredGender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
}, { _id: false });


const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6 },
  phone:       { type: String, trim: true },
  avatar:      { type: String, default: '' },
  role:        { type: String, enum: ['seeker', 'lister', 'both'], default: 'seeker' },
  bio:         { type: String, maxlength: 500, default: '' },

  preferences: { type: preferenceSchema, default: () => ({}) },

  savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

  isVerified:  { type: Boolean, default: false },
}, { timestamps: true });


// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// 🔑 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// 🚫 Hide password in responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};


const User = mongoose.model('User', userSchema);

export default User;