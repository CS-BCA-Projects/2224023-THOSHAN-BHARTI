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
      emotionalIssue: user.emotionalIssue || 'Not shared',
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

// GET Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // Redirect to login page after logout
  });
});

module.exports = router;
