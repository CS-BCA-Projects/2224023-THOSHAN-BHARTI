const express = require('express');
const router = express.Router();
const Music = require('../models/musics'); // Assuming this is your MongoDB model

// Playlist Route - Display All or Filter by Genre
router.get('/playlist', async (req, res) => {
    const genreFilter = req.query.genre;

    try {
        let musicData;
        if (genreFilter) {
            musicData = await Music.find({ Genre: genreFilter }); // Filter by genre
        } else {
            musicData = await Music.find(); // Show all songs
        }

        res.render('playlist', { musicData, genreFilter });
    } catch (err) {
        console.error('Error fetching music data:', err);
        res.status(500).send('Server Error');
    }
    try {
        // Fetch songs from your MongoDB database
        const songs = await Song.find();  // Assuming you have a Song model defined
        res.render('playlist', { songs });  // Passing songs to EJS template
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
