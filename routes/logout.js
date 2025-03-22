const express = require('express');
const router = express.Router();

// Logout Route
router.post('/logout', (req, res) => {
    if (!req.session) {
        return res.status(400).json({ message: 'No active session found' });
    }

    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('token'); // Clear JWT token
        res.status(200).json({ message: 'Logged out successfully', redirectUrl: '/login' });
    });
});

module.exports = router;
