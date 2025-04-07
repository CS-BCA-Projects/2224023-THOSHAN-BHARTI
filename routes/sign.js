
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => res.render('signup')); // Renders Signup Page

// Signup Route
router.post('/', async (req, res) => {
    const {username, email, password } = req.body;

    console.log("data received : " ,username,email,password)
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    console.log("target hitted");
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists.', redirectUrl: '/login' });
        }

        console.log("target hitted");
        try {
            const existingUser = await User.findOne({ username });
    
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Username already exists.', redirectUrl: '/login' });
            }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        if(!newUser){
            return res.status(400).json({ success: false, message: 'Failed to create new'})
        }
        return res.status(200)
        .json({ success: true, message: 'Signup successful! Redirecting...', redirectUrl: '/login' });

    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
        }
        });




module.exports = router;