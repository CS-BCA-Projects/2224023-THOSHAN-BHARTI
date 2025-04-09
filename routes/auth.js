const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// GET Login Page
router.get('/', (req, res) => {
    res.render('login');
});

// POST Login Request
// login.js POST
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
// Temporarily add this inside your login route after finding the user
console.log('User isAdmin:', user.isAdmin);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    req.session.user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.email === 'thoshansbg2005@gmail.com'

    };
    console.log('Session after login:', req.session.user);

    res.json({ message: 'Login successful', redirectTo: '/' }); // ✅ JSON response
});

// GET Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
