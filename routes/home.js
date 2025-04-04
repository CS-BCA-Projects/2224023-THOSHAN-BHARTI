const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    res.render('home'); // This will render home.ejs from the views folder
});

module.exports = router;
