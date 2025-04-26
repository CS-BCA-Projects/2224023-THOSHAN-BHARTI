const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// GET Login Page
router.get('/', (req, res) => {
  res.render('login');
});

// POST Login Request
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email }).lean(); // ✅ lean() ensures we can access fields safely

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // ✅ Store complete user info in session
    req.session.user = {
      _id: user._id,
      username: user.username || 'Anonymous',
      email: user.email,
      age: user.age || 'Not set',
      profileImage: user.profileImage || '/images/avatar.png',
     
      isAdmin: user.isAdmin || (user.email === 'thoshansbg2005@gmail.com') // fallback admin logic
    };

    req.session.userId = user._id;
    console.log('✅ Session after login:', req.session.user);

    res.json({ message: 'Login successful', redirectTo: '/' });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Something went wrong on login' });
  }
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.log(err);
          res.send('Error logging out');
      } else {
          res.redirect('/login');
      }
  });
});
// Forgot Password - form
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

// POST: Email received → send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.render('forgot-password', { error: 'Email not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 60 ;
  await user.save();

  await sendOTP(email, otp);
  req.session.resetEmail = email;

  res.redirect('/verify-otp');
});

// GET: OTP input page
router.get('/verify-otp', (req, res) => {
  res.render('verify-otp');
});

// POST: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  const email = req.session.resetEmail;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.render('verify-otp', { error: 'Invalid or expired OTP' });
  }

  req.session.otpVerified = true;
  res.redirect('/reset-password');
});

// GET: Reset password
router.get('/reset-password', (req, res) => {
  if (!req.session.otpVerified) return res.redirect('/forgot-password');
  res.render('reset-password');
});

// POST: Save new password
router.post('/reset-password', async (req, res) => {
  const { password } = req.body;
  const email = req.session.resetEmail;
  const user = await User.findOne({ email });

  user.password = password; // Assume hashing is handled in your model
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  req.session.otpVerified = false;
  req.session.resetEmail = null;

  res.redirect('/login');
});



module.exports = router;
