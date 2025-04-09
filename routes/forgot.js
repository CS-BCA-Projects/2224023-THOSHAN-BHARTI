const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
require('dotenv').config(); // Make sure this is at the top

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// GET: forgot password page
router.get('/', (req, res) => {
  res.render('forgot'); // Make sure forgot.ejs exists in views/
});

// POST: handle email form
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log('Reset link:', resetLink); // 🐞 

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yourgmail@gmail.com',
        pass: 'your-app-password',
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Link',
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.send('Password reset email sent!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;
