const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: false },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Social & media
  profileImage: { type: String, default: '/images/avatar.png' },
  uploadedTracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  favorites:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  history:        [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  followers:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Personal info
  age: { type: Number, required: false },
  emotionalIssues: [String],       // ["anxiety", "stress"]
  preferredGenres:  [String],      // ["relax", "focus"]

  // Mood journaling
  moodHistory: [{
    date: { type: Date, default: Date.now },
    mood: {
      type: String,
      enum: ['happy', 'relaxed', 'energetic', 'melancholy'],
      required: true
    },
    notes: { type: String, default: '' }
  }],

  // Roles
  isAdmin: { type: Boolean, default: false },

  // OTP for password reset
  otp: String,
  otpExpires: Date

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
