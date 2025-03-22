const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Artist: { type: String, required: true },
    Genre: { type: String, required: true },
    Duration: { type: String, required: true },
    Audio_Path: { type: String, required: true }  // Store the path to the audio file
  });

module.exports = mongoose.model('musics', musicSchema);
