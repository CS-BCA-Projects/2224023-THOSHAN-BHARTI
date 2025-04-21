const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');

router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).send("Playlist not found");

    res.render('playlist-view', { playlist });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Playlist page - fetch all songs from DB
router.get('/playlist', async (req, res) => {
  try {
      const sounds = await Sound.find({});
      res.render('playlist', { sounds });
  } catch (err) {
      res.status(500).send('Failed to load playlist');
  }
});


module.exports = router;
