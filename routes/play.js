const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const Music = require('../models/musics.js'); // MongoDB model
require('dotenv').config();

// Spotify API Setup
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,   // Corrected typo in environment variable
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Corrected typo
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Authenticate with Spotify
async function authenticateSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
    } catch (error) {
        console.error('Spotify Authentication Error:', error);
    }
}

// Emotion-to-Theme Mapping
const emotionToTheme = {
    "Joyful": "happy upbeat playlist",
    "Calm": "calm meditation sounds",
    "Focused": "focus study music",
    "Romantic": "romantic instrumental",
    "Peaceful": "serene mindfulness music",
    "Melancholic": "reflective piano melodies",
    "Sleepy": "deep sleep music",
    "Hopeful": "uplifting motivational songs"
};

// Route for Spotify Song Recommendations
router.get('/recommendation', async (req, res) => {
    await authenticateSpotify();  // Ensure Spotify API is authenticated
    const emotion = req.query.emotion || 'Calm';
    const theme = emotionToTheme[emotion] || 'relaxing music for mental health';

    try {
        const result = await spotifyApi.searchTracks(theme, { limit: 5 });

        const songs = result.body.tracks.items.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            url: track.external_urls.spotify
        }));

        res.json({ emotion, songs });
    } catch (error) {
        console.error('Spotify Error:', error);
        res.status(500).json({ error: 'Error fetching songs. Try again!' });
    }
});

// MongoDB Playlist Route - Display All or Filter by Genre
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
