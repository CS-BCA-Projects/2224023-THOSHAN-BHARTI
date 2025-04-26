// middleware/auth.js

function isLoggedIn(req, res, next) {
  if (req.session.user) {
      next(); // User is logged in, proceed to requested page
  } else {
      res.redirect('/login'); // Not logged in, go to login page
  }
}

module.exports = { isLoggedIn };
