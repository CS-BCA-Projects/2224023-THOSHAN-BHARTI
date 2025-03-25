// const express = require('express');
// const SpotifyWebApi = require('spotify-web-api-node');

// const router = express.Router();

// // Spotify API Setup
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//     redirectUri:process.env.SPOTIFY_REDIRECT_URI
// });

// // Obtain Spotify Token
// spotifyApi.clientCredentialsGrant().then(
//     data => spotifyApi.setAccessToken(data.body['access_token']),
//     err => console.error('Spotify token error:', err)
// );

// function getSongsByTheme(emotion) {
//     const emotionToTheme = {
//         "Energetic": "upbeat motivational music",
//         "Calm": "calm meditation sounds",
//         "Focused": "focus study music",
//         "Loving": "romantic instrumental",
//         "Tranquil": "peaceful ambiance",
//         "Thoughtful": "reflective piano music",
//         "Drowsy": "deep sleep meditation",
//         "Bright": "morning positivity playlist"
//     };
// };

// const themeQuery = emotionToTheme[emotion] || "relaxing music for mental health";

// sp.search({ q: `${themeQuery} playlist -dog -pet`, type: "playlist", limit: 1 })
//     .then(response => {
//         const playlists = response.playlists.items;
//         if (!playlists.length) {
//             return ["No matching songs found."];
//         }
        
//         const playlistId = playlists[0].id;
//         return sp.playlistTracks(playlistId, { limit: 10 }).then(tracks => {
//             return tracks.items.map(track => `${track.track.name} - ${track.track.artists[0].name}`);
//         });
//     });


// // Route to Get Songs Based on Emotion
// router.get('/', async (req, res) => {
//     const emotion = req.query.emotion || "calm";
//     const themeDescription = emotionToTheme[emotion.toLowerCase()] || "calm relaxation";

//     try {
//         const results = await spotifyApi.searchPlaylists(`${themeDescription} playlist`, { limit: 1 });

//         if (!results.body.playlists.items.length) {
//             return res.json(["No matching songs found."]);
//         }

//         const playlistId = results.body.playlists.items[0].id;
//         const tracks = await spotifyApi.getPlaylistTracks(playlistId, { limit: 10 });

//         const songs = tracks.body.items.map(track => {
//             const song = track.track;
//             return `${song.name} - ${song.artists[0].name}`;
//         });

//         res.json(songs.slice(0, 6)); // Limit to 6 songs
//     } catch (error) {
//         console.error('Error fetching songs:', error);
//         res.status(500).json({ error: 'Failed to fetch songs' });
//     }
// });

// module.exports = router;

















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
