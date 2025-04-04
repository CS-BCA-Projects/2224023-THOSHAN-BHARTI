const mongoose = require('mongoose');

// Comment schema
const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  date: { type: Date, default: Date.now }
});

// Comment model
module.exports = mongoose.model('Comment', commentSchema);
