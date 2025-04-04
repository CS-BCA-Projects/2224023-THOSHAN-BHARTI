// const express = require("express");
// const router = express.Router();
// const User = require("../models/user"); // Import User model
// const { isAuthenticated } = require("../middlewares/auth"); // Ensure user is logged in

// router.get("/", isAuthenticated, async (req, res) => {
//     res.render("profile", { user: req.session.user });
// });

// router.post("/update", isAuthenticated, async (req, res) => {
//     const { name } = req.body;
//     await User.findByIdAndUpdate(req.session.user._id, { name });
//     req.session.user.name = name; // Update session
//     res.redirect("/profile");
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const User = require('../models/user');

// router.get('/', async (req, res) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Redirect if not logged in
//     }

//     try {
//         const user = await User.findById(req.session.user._id);

//         if (!user) {
//             return res.redirect('/login'); // Redirect if user not found
//         }

//         res.render('profile', { user });
//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         res.status(500).send("Server Error");
//     }
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/user'); // Ensure correct path
// const bcrypt = require('bcrypt');

// // ✅ Define ensureAuthenticated BEFORE using it
// const ensureAuthenticated = (req, res, next) => {
//     if (!req.session.user) {
//         return res.redirect('/login'); // Redirect to login if not logged in
//     }
//     next(); // Continue if authenticated
// };

// // ✅ Use ensureAuthenticated AFTER defining it
// router.get('/profile', ensureAuthenticated, async (req, res) => {
//     try {
//         const user = await User.findById(req.session.user._id);
//         res.render('profile', { user });
//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         res.redirect('/login');
//     }
// });

// // ✅ Update Profile (Change Name)
// router.post('/profile/update', ensureAuthenticated, async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.session.user._id,
//             { name: req.body.name },
//             { new: true }
//         );

//         if (updatedUser) {
//             req.session.user.name = updatedUser.name; // Update session
//             return res.json({ success: true, message: "Profile updated successfully." });
//         }

//         res.status(400).json({ success: false, message: "User not found." });
//     } catch (error) {
//         console.error("Profile Update Error:", error);
//         res.status(500).json({ success: false, message: "Server error." });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure correct path

// ✅ Middleware to check authentication
const ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    next(); // Continue if authenticated
};

// ✅ Render Profile Page
router.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id).select("-password"); // Exclude password
        if (!user) {
            req.session.destroy(); // Destroy session if user not found
            return res.redirect('/login');
        }
        res.render('profile', { user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.redirect('/login');
    }
});

// ✅ Update Profile (Change Name)
router.post('/profile/update', ensureAuthenticated, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { name },
            { new: true }
        );

        if (updatedUser) {
            req.session.user.name = updatedUser.name; // Update session data
            return res.json({ success: true, message: "Profile updated successfully." });
        }

        res.status(400).json({ success: false, message: "User not found." });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

// ✅ Logout and Clear Session
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
