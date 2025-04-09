const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// GET: Render reset password form
router.get('/:token', async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send('Invalid or expired token');
    res.render('reset-password', { token }); // Make sure you have this EJS view
});

// POST: Reset password
router.post('/:token', async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) return res.status(400).send('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.send('Password updated successfully. You can now login.');
});

module.exports = router;
