const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  file: { 
    type: String, 
    required: true,
    trim: true 
  },
  image: { 
    type: String, 
    required: true,
    trim: true 
  }
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields automatically
  versionKey: false   // Removes the "__v" version key that mongoose adds by default
});

module.exports = mongoose.model('Song', songSchema);
