const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sound = require('../models/Songs');

// 🔒 Middleware to check admin access
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    return res.status(403).send('Access denied. Admins only.');
}

// ✅ Admin Dashboard (Protected)
router.get('/', isAdmin, (req, res) => {
    res.render('admin'); // only admin can access
  });
  

// ✅ Fetch All Users (Protected)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'email _id');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// ✅ Fetch All Sounds (Protected)
router.get('/sounds', isAdmin, async (req, res) => {
    try {
        const sounds = await Sound.find({}, 'title fileUrl');
        res.json(sounds);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sounds' });
    }
});

// ✅ Add Sound (Protected)
router.post('/add-sound', isAdmin, async (req, res) => {
    const { title, fileUrl, genre } = req.body;
    try {
        const newSound = new Sound({ title, fileUrl, genre });
        await newSound.save();
        res.json({ 
            success: true,
            message: 'Sound added successfully',
            redirectUrl: '/admin'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error adding sound: ' + error.message
        });
    }
});

// ✅ Delete User (Protected)
router.post('/delete-user/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin'); // Reload page
    } catch (error) {
        res.status(500).send('Error deleting user.');
    }
    if (req.session.user && req.session.user.isAdmin) {
        // show admin controls
    }
    
});
router.post('/delete-sound/:id', isAdmin, async (req, res) => {
    try {
        await Sound.findByIdAndDelete(req.params.id);
        res.redirect('/admin'); // Reload page
    } catch (error) {
        res.status(500).send('Error deleting user.');
    }
    if (req.session.Sound && req.session.Sound.isAdmin) {
        // show admin controls
    }
    
});

module.exports = router;