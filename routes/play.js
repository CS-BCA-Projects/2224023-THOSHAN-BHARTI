// routes/play.js
const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Sound = require('../models/song');
const mongoose = require('mongoose');

// ✅ Fetch and render all songs (static + uploaded)
router.get('/playlist', async (req, res) => {
    try {
        console.log('MongoDB Connection State:', mongoose.connection.readyState);
        console.log('Database Name:', mongoose.connection.name);

        // Static songs (hardcoded)
        const staticSounds = [
            { id: 'energy', title: 'Bright Morning', file: '/Songs/bright.mp3', image: '/images/bright.jpg' },
            { id: 'calm', title: 'Cheerful Vibes', file: '/Songs/cheerful.mp3', image: '/images/cheerful.jpg' },
            { id: 'focus', title: 'Focus Mode', file: '/Songs/focus.mp3', image: '/images/focus.jpg' },
            { id: 'heartfelt', title: 'Heartfelt', file: '/Songs/heartfelt.mp3', image: '/images/heartfelt.jpg' },
            { id: 'peaceful', title: 'Peaceful Evening', file: '/Songs/peaceful.mp3', image: '/images/peaceful.jpg' },
            { id: 'rain', title: 'Rainy Day', file: '/Songs/rain.mp3', image: '/images/rain.jpg' },
            { id: 'soothing', title: 'Soothing Nature', file: '/Songs/soothing.mp3', image: '/images/soothing.jpg' }
        ];

        // Fetch uploaded songs from MongoDB
        const uploadedSounds = await Sound.find({});
        const mappedUploadedSounds = uploadedSounds.map(song => ({
            id: song._id.toString(),
            title: song.title || 'Untitled',
            file: song.file || '',
            image: song.image || '/images/default-song.jpg' // fallback image
        }));

        // Merge static and uploaded songs
        const allSounds = [...staticSounds, ...mappedUploadedSounds];

        console.log(`Rendering ${allSounds.length} songs.`);

        res.render('playlist', { sounds: allSounds });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).send('Server Error');
    }
});

// ✅ View individual playlist (by ID)
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).send('Playlist not found');
        }
        res.render('playlist-view', { playlist });
    } catch (error) {
        console.error('Error fetching individual playlist:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
