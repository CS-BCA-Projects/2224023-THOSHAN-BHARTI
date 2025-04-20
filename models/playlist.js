const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  youtubeUrl: String,
  thumbnail: String,
});

const playlistSchema = new mongoose.Schema({
  name: String,
  image: String,
  type: String,
  mood: String,
  tracks: [trackSchema]
});

module.exports = mongoose.model('Playlist', playlistSchema);
