module.exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
};
// middleware/auth.js
function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access Denied: Admins Only');
    }
}

module.exports = { ensureAdmin };
