// const express = require('express');
// const router = express.Router();
// const User = require('../models/user.js');  // Ensure this path is correct
// const bcrypt = require('bcrypt');
// const sendEmail = require("../routes/email.service.js"); // Ensure this file exists

// // Render Signup Page (if needed)
// router.get('/signup', (req, res) => {
//     res.render('signup');  // Ensure 'signup.ejs' exists in `/views`
// });

// // Signup Route (POST)
// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;

//     console.log("Data received:", email, password);

//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: 'Email and password are required.' });
//     }

//     try {
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ success: false, message: 'Email already exists.', redirectUrl: '/login' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = await User.create({ email, password: hashedPassword });

//         if (!newUser) {
//             return res.status(400).json({ success: false, message: 'Failed to create a new account.' });
//         }

//         // Send confirmation email
//         const emailResult = await sendEmail(
//             email,
//             "Welcome to Healing Music 🎶",
//             "Thank you for joining us!",
//             `<h2>Welcome to Healing Music 🎶</h2>
//              <p>We hope our music helps you find peace, relaxation, and healing.</p>
//              <p>Enjoy your journey with us!</p>`
//         );

//         if (!emailResult.success) {
//             console.error("Email failed:", emailResult.error);
//             return res.status(500).json({ success: false, message: "Signup successful, but email not sent." });
//         }

//         return res.status(200).json({ success: true, message: 'Signup successful! Check your email.', redirectUrl: '/login' });

//     } catch (error) {
//         console.error('Error during signup:', error.message);
//         res.status(500).json({ success: false, message: 'Server error.' });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const sendEmail = require("../routes/email.service.js");

// Render Signup Page
router.get('/signup', (req, res) => {
    res.render('signup');  // Ensure `signup.ejs` exists
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Data received:", username, email, password);

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Username, Email, and Password are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists.', redirectUrl: '/login' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
    
        // Save user session
        req.session.user = { id: newUser._id, username: newUser.username, email: newUser.email };

        // Send confirmation email
        const emailResult = await sendEmail(
            email,
            "Welcome to Healing Music 🎶",
            "Thank you for joining us!",
            `<h2>Welcome to Healing Music 🎶</h2>
             <p>We hope our music helps you find peace, relaxation, and healing.</p>
             <p>Enjoy your journey with us!</p>`
        );

        if (!emailResult.success) {
            console.error("Email failed:", emailResult.error);
            return res.status(500).json({ success: false, message: "Signup successful, but email not sent." });
        }

        return res.status(200).json({ success: true, message: 'Signup successful! Redirecting...', redirectUrl: '/profile' });

    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json({ success: false, message: 'Unexpected error occurred. Please try again.' });
    }
});

module.exports = router;
