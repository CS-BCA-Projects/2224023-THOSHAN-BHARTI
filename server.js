const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
dotenv.config();

// Connect MongoDB
connectDB();

// User schema
const User = require('./models/user');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use("/songs", express.static(path.join(__dirname, "public", "Songs")));

// Add session to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Route imports
const authRoutes = require('./routes/auth');
const signRoutes = require('./routes/sign');
const moodRoutes = require('./routes/mood');
const playRoutes = require('./routes/play');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const youtubeRoutes = require('./routes/youtubeRoutes');
const browseRoutes = require('./routes/browse');

// Routes
app.use('/login', authRoutes);
app.use('/signup', signRoutes);
app.use('/playlist', playRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/library', youtubeRoutes);
app.use('/moodTracker', moodRoutes);
app.use('/browse', browseRoutes);

// Home
app.get('/', (req, res) => {
    res.render('home');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// Static Views
app.get('/relax', (req, res) => res.render('relax'));
app.get('/playlist', (req, res) => res.render('playlist'));

// Check Auth (AJAX-friendly)
app.get('/checkAuth', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user.username });
    } else {
        res.json({ success: false });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❗ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
