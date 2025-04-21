const mongoose = require('mongoose');

const LibraryItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  videoId: String,
  thumbnail: String,
  type: { type: String, enum: ['playlist', 'favorite', 'history'] },
  playedAt: Date // only for history
}, { timestamps: true });

module.exports = mongoose.model('LibraryItem', LibraryItemSchema);
