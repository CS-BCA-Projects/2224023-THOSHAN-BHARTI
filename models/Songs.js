const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    enum : ['Energy', 'Focus', 'Relax', 'Calm'] // Example genres
  },
  fileUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Songs", SongSchema);
