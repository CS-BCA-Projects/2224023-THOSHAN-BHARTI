const express = require('express');
const router = express.Router();
const Music = require('../models/musics.js'); // MongoDB model

// Playlist Route - Display All or Filter by Genre
router.get('/playlist', async (req, res) => {
    const genreFilter = req.query.genre;

    try {
        const musicData = genreFilter 
            ? await Music.find({ Genre: genreFilter })  // Filter by genre
            : await Music.find();  // Show all songs

        return res.render('playlist', { musicData, genreFilter });
    } catch (err) {
        console.error('Error fetching music data:', err);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
