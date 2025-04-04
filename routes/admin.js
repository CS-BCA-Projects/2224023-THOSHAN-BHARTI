// const express = require('express');
// const router = express.Router();
// const User = require('../models/user'); // User model
// const Sound = require('../models/sound'); // Sound model

// // Admin Dashboard Page
// router.get('/admin', async (req, res) => {
//     try {
//         const totalUsers = await User.countDocuments();
//         const totalSounds = await Sound.countDocuments();
//         res.render('admin', { totalUsers, totalSounds });
//     } catch (error) {
//         res.status(500).send('Error loading admin dashboard.');
//     }
// });

// // Fetch All Users (for frontend display)
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({}, 'email _id'); // Fetch only email and _id
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching users' });
//     }
// });

// // Fetch All Sounds (for frontend display)
// router.get('/sounds', async (req, res) => {
//     try {
//         const sounds = await Sound.find({}, 'title fileUrl');
//         res.json(sounds);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching sounds' });
//     }
// });

// // Add Sound
// router.post('/add-sound', async (req, res) => {
//     const { title, fileUrl } = req.body;
//     try {
//         const newSound = new Sound({ title, fileUrl });
//         await newSound.save();
//         res.status(201).json({ message: 'Sound added successfully!' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error adding sound' });
//     }
// });

// // Delete User
// router.post('/delete-user/:id', async (req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id);
//         res.json({ message: 'User deleted successfully!' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error deleting user' });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sound = require('../models/Songs');

// ✅ Fix: Admin Dashboard Route
router.get('/', async (req, res) => {
    res.render('admin'); // Ensure `admin.ejs` exists in `views`
});

// ✅ Fetch All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'email _id');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// ✅ Fetch All Sounds
router.get('/sounds', async (req, res) => {
    try {
        const sounds = await Sound.find({}, 'title fileUrl');
        res.json(sounds);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sounds' });
    }
});

// ✅ Add Sound
router.post('/add-sound', async (req, res) => {
    const { title, fileUrl } = req.body;
    try {
        const newSound = new Sound({ title, fileUrl });
        await newSound.save();
        res.redirect('/admin'); // Reload page
    } catch (error) {
        res.status(500).send('Error adding sound.');
    }
});

// ✅ Delete User
router.post('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin'); // Reload page
    } catch (error) {
        res.status(500).send('Error deleting user.');
    }
});

module.exports = router;
