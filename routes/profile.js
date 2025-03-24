const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Import the User model

// Profile Page Route
router.get('/profile', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/login'); // Redirect to login if user is not authenticated
    }

    const user = await User.findById(userId);
    res.render('profile', { user });
});

// Edit Profile
router.post('/profile/edit', async (req, res) => {
    const { name, email } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.redirect('/login');

    await User.findByIdAndUpdate(userId, { name, email });
    res.redirect('/profile');
});

// Delete Profile
router.post('/profile/delete', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/login');

    await User.findByIdAndDelete(userId);
    req.session.destroy();  // Log the user out after deletion
    res.redirect('/signup');
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
