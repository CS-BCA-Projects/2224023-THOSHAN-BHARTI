// routes/profile.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('../middleware/auth'); // Import the isLoggedIn middleware
const User = require('../models/user');

// ✅ Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Specify upload directory
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname; // Unique filename
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ My Account Page - GET request
router.get('/account', isLoggedIn, (req, res) => {
  res.render('account', { user: req.session.user }); // Render the account page with user data
});

// ✅ Edit Account Form - GET request
router.get('/edit', isLoggedIn, (req, res) => {
  res.render('editAccount', { user: req.session.user }); // Render the edit form with user data
});

// ✅ Handle Edit Form (email, password, age, emotionalIssue, optional image) - POST request
router.post('/edit', isLoggedIn, upload.single('profileImage'), async (req, res) => {
  const { email, password, age, emotionalIssue, username } = req.body;
  const updates = { email, age, emotionalIssue, username };

  // If there's a profile image, update the path
  if (req.file) {
    updates.profileImage = '/uploads/' + req.file.filename;
  }

  // If a new password is provided, hash it and update
  if (password && password.length >= 6) {
    const hashed = await bcrypt.hash(password, 10);
    updates.password = hashed;
  }

  try {
    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id, // Use the user ID stored in session
      updates,
      { new: true } // Return the updated user
    ).lean(); // Convert to plain object for session update

    // Sync the updated user data with the session
    req.session.user = updatedUser;

    // Redirect to the account page
    res.redirect('/profile/account');
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
