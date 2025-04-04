const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// ✅ Render Login Page
router.get('/', (req, res) => {
    res.render('login'); // Make sure login.ejs exists in the /views folder
});

// ✅ Handle Login Logic
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password.' });
        }

        // ✅ Store user info in session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name || ''
        };

        // ✅ Return success with redirect
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            redirectUrl: '/profile'
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// ✅ Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
