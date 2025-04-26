const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sound = require('../models/song');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../middleware/auth');

// 🔒 Middleware to check admin access
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.status(403).send('Access denied. Admins only.');
}

// Admin Dashboard
router.get('/', isLoggedIn, isAdmin, (req, res) => {
  res.render('admin');
});

// Users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'email _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Delete User
router.post('/delete-user/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    res.status(500).send('Error deleting user.');
  }
});

// Set up multer storage for song and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('image') ? 'public/images' : 'public/Songs';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

// Upload Song Route
router.post('/upload-song', isAdmin, upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.files.file[0];
    const image = req.files.image[0];

    const newSong = new Sound({
      title,
      file: `/Songs/${file.filename}`,
      image: `/images/${image.filename}`
    });

    await newSong.save();
    console.log('Song uploaded:', newSong);
    res.redirect('/admin');
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Upload failed.');
  }
});

// Get all songs for the admin page
router.get('/songs', isAdmin, async (req, res) => {
  try {
    const songs = await Sound.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching songs' });
  }
});

// Delete Song Route
router.delete('/delete-song/:id', isAdmin, async (req, res) => {
  try {
    const song = await Sound.findByIdAndDelete(req.params.id);
    
    const filePath = path.join(__dirname, `../public${song.file}`);
    const imagePath = path.join(__dirname, `../public${song.image}`);
    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    res.status(200).json({ message: 'Song deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).send('Delete failed');
  }
});

module.exports = router;