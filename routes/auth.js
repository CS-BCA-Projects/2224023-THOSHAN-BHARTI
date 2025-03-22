const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For JWT
const session = require('express-session');

// Session Middleware (Add this in your `server.js` file before routes)
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set 'secure: true' if using HTTPS
}));

// Login Route
router.get('/', (req, res) => {
    res.render('login');  // Ensure 'login.ejs' is inside your `/views` folder
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log("Data got : ",email,password)
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        return res.status(200)
        .json({ message: 'Login successful', user: user, redirectUrl : '/playlist' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;