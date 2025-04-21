const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/user');

// ✅ Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ My Account Page
router.get('/account', isAuthenticated, (req, res) => {
  res.render('account', { user: req.session.user });
});

// ✅ Edit Account Form
router.get('/edit', isAuthenticated, (req, res) => {
  res.render('editAccount', { user: req.session.user });
});

// ✅ Handle Edit Form (email, password, age, emotionalIssue, optional image)
router.post('/edit', isAuthenticated, upload.single('profileImage'), async (req, res) => {
  const { email, password, age, emotionalIssue, username } = req.body;
  const updates = { email, age, emotionalIssue, username};

  if (req.file) {
    updates.profileImage = '/uploads/' + req.file.filename;
  }

  if (password && password.length >= 6) {
    const hashed = await bcrypt.hash(password, 10);
    updates.password = hashed;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user._id,
      updates,
      { new: true }
    ).lean(); // 🔄 Convert to plain object

    req.session.user = updatedUser; // ✅ Sync session with new data
    res.redirect('/profile/account');
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
