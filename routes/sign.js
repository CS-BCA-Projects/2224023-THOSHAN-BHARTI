const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.get('/', (req, res) => res.render('signup')); // Renders Signup Page

// Signup Route
router.post('/', async (req, res) => {
    const { username, email, password, age } = req.body;

    console.log("Data received:", username, email, password, age );

    if (!email || !password || !username  || !data.cnfPassword ||!age) {
        return res.status(400).json({ success: false, message: 'Username, email,  age , and password are required.' });
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
            age
        });

        if (!newUser) {
            return res.status(400).json({ success: false, message: 'Failed to create user.' });
        }

        // --- Nodemailer Email Setup using environment variables ---
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Serenity App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Serenity 🌿',
            html: `
                <h2>Hi ${username},</h2>
                <p>Thanks for signing up to <strong>Serenity</strong> — your peaceful space for music and mindfulness. 🌸</p>
                <p>We're so glad to have you here!</p>
                <br>
                <p>✨ Stay relaxed,<br>The Serenity Team</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending welcome email:', error);
            } else {
                console.log('Welcome email sent:', info.response);
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Signup successful! Welcome email sent. Redirecting...',
            redirectUrl: '/login'
        });

    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
