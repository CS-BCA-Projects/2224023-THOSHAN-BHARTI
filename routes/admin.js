const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sound = require('../models/song');

// 🔒 Middleware to check admin access
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.status(403).send('Access denied. Admins only.');
}

// Admin Dashboard
router.get('/', isAdmin, (req, res) => {
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
  router.delete('/delete/:id', async (req, res) => {
    try {
      await Sound.findByIdAndDelete(req.params.id);
      res.redirect('/playlist');
    } catch (err) {
      res.status(500).send('Delete failed');
    }
  });
    
  
module.exports = router;
