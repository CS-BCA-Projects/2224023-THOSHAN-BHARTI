const express = require('express');
const router = express.Router();
const User = require('../models/user');

const ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
};

router.get('/', ensureAuthenticated, async (req, res) => {
    const user = await User.findById(req.session.user._id).select("-password");
    res.render('profile', { user });
});

router.post('/update', ensureAuthenticated, async (req, res) => {
    const { name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.session.user._id, { name }, { new: true });
    req.session.user.name = updatedUser.name;
    res.json({ success: true, message: "Profile updated." });
});
// Add/Remove Favorite
router.post('/favorites', async (req, res) => {
    const { title, filename } = req.body;
    const userId = req.session.user?._id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findById(userId);
        const existing = user.favorites.find(f => f.filename === filename);

        if (existing) {
            user.favorites = user.favorites.filter(f => f.filename !== filename);
        } else {
            user.favorites.push({ title, filename });
        }

        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch Favorites
router.get('/favorites', async (req, res) => {
    const userId = req.session.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findById(userId);
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
