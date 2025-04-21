const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  genre: String
});

module.exports = mongoose.model('Songs', songSchema);
