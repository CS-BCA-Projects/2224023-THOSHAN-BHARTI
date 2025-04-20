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




module.exports = router;
