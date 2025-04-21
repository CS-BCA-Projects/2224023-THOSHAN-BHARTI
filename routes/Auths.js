const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendOTP } = require('../utils/mailer');

// GET: Forgot Password Form
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

// POST: Send OTP to user's email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.render('forgot-password', { error: 'Email not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  await sendOTP(email, otp);
  req.session.resetEmail = email;

  res.redirect('/verify-otp');
});

// GET: OTP Verification Page
router.get('/verify-otp', (req, res) => {
  res.render('verify-otp');
});

// POST: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const email = req.session.resetEmail;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render('verify-otp', { error: 'User session expired. Please start again.' });
  }

  if (!user.age) user.age = 0;

  if (Date.now() > user.otpExpires) {
    return res.render('verify-otp', {
      error: 'OTP has expired. Please request a new one.',
      expired: true
    });
  }

  if (user.otp !== otp) {
    return res.render('verify-otp', { error: 'Invalid OTP. Please try again.' });
  }

  req.session.otpVerified = true;
  res.redirect('/reset-password');
});

// GET: Reset Password Form
router.get('/reset-password', (req, res) => {
  if (!req.session.otpVerified) return res.redirect('/forgot-password');
  res.render('reset-password');
});

// POST: Save New Password
router.post('/reset-password', async (req, res) => {
  const { password } = req.body;
  const email = req.session.resetEmail;
  const user = await User.findOne({ email });

  // Optional: add confirmPassword check if you include it in form

  user.password = await bcrypt.hash(password, 12); // Secure hash
  user.otp = null;
  user.otpExpires = null;
  // ✅ Prevent validation crash on incomplete users
if (!user.username) user.username = 'Anonymous';
if (!user.age) user.age = 0;

await user.save();

  await user.save();

  req.session.otpVerified = false;
  req.session.resetEmail = null;

  res.redirect('/login');
});

module.exports = router;
