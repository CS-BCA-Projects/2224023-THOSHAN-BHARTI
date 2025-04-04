const express = require('express');
const router = express.Router();
const Song = require('../models/Songs.js'); // MongoDB model


 router.get ('/',(req ,res)=>{
    res.render('playlist');  // Ensure 'login.ejs' is inside your `/views` folder
});


// Route to fetch and display playlist songs
router.get('/playlist', async (req, res) => {
    const genreFilter = req.query.genre;  // Get genre from query params

    try {
        const SongData = genreFilter 
            ? await Song.find({ genre: genreFilter })  // Filter by genre
            : await Song.find();  // Fetch all songs

        return res.render('playlist', { SongData, genreFilter }); // Pass data to frontend
    } catch (err) {
        console.error('Error fetching music data:', err);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
