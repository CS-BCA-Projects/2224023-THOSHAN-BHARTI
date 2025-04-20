const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => res.render('signup')); // Renders Signup Page

// Signup Route
router.post('/', async (req, res) => {
    const { username, email, password, age, emotionalIssue } = req.body;

    console.log("Data received:", username, email, password, age, emotionalIssue);

    if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: 'Username, email, and password are required.' });
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists.', redirectUrl: '/login' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: 'Username already exists.', redirectUrl: '/login' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            age,
            emotionalIssue
        });

        if (!newUser) {
            return res.status(400).json({ success: false, message: 'Failed to create user.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Signup successful! Redirecting...',
            redirectUrl: '/login'
        });

    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
