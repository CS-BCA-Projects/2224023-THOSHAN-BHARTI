const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    const user = req.session.user || null;
    res.render('home', { user });
});

module.exports = router;
