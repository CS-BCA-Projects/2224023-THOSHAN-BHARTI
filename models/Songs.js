const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  fileUrl: String,
});

module.exports = mongoose.model("Songs", SongSchema);
