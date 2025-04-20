
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favorites: [{
    title: String,
    filename: String
  }],
  age: { type: Number, required: true },
  emotionalIssues: [String], // e.g., ["anxiety", "stress"]
  preferredGenres: [String], // e.g., ["relax", "focus"]
  profilePhoto: { type: String, default: '/images/default-profile.png' },
  

favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
history: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
uploadedTracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
profilePic: String, // Optional

    isAdmin: {
      type: Boolean,
      default: false
  },
  moodHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    mood: {
      type: String,
      enum: ['happy', 'relaxed', 'energetic', 'melancholy'],
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  // Other fields like age, emotionalIssues, etc., can be added here if needed
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);