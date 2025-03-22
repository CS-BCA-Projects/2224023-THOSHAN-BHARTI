const express = require('express');
const router = express.Router();
const User = require('./models/user'); // Assuming user model exists
const Sound = require('./models/musics'); // Assuming sound model exists


router.get('/', (req, res) => {
    res.render('admin');  // Ensure 'login.ejs' is inside your `/views` folder
});
// Admin Dashboard - Overview Route
router.post('/', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSounds = await Sound.countDocuments();
        res.render('admin', { totalUsers, totalSounds });
    } catch (error) {
        res.status(500).json({ message: 'Error loading admin dashboard.' });
    }
});

// Manage Users Route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('manageUsers', { users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

router.post('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

// Add Sound Route
router.post('/add-sound', async (req, res) => {
    const { title, fileUrl } = req.body;
    try {
        const newSound = new Sound({ title, fileUrl });
        await newSound.save();
        res.redirect('/admin');
    } catch (error) {
        res.status(500).json({ message: 'Error adding sound.' });
    }
});

// Display Sounds
router.get('/sounds', async (req, res) => {
    try {
        const sounds = await Sound.find();
        res.render('manageSounds', { sounds });
    } catch (error) {
        res.status(500).json({ message: 'Error loading sounds.' });
    }
});

module.exports = router;