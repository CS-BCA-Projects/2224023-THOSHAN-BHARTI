const express = require('express');
const { spotifyApi, getAccessToken } = require('./spotifyAuth');
const router = express.Router();

// Get playlist data
router.get('/playlist/:id', async (req, res) => {
    await getAccessToken(); // Ensure token is fresh
    const playlistId = req.params.id;

    try {
        const data = await spotifyApi.getPlaylist(playlistId);
        res.render('playlist', { playlist: data.body });
    } catch (error) {
        res.status(500).send('Error fetching playlist data');
    }
});

module.exports = router;
