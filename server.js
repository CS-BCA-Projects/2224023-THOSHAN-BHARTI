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
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
dotenv.config();
const apiRoutes = require('./routes/api');


// Connect MongoDB
connectDB();

// User schema (ensure moodHistory is included)
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
app.use('/api', apiRoutes);
// Add session to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// OAuth 2.0 Configuration for YouTube API
const oauth2Client = new OAuth2Client(
    process.env.CLIENT_ID, // From .env
    process.env.CLIENT_SECRET, // From .env
    'http://localhost:3000/auth/callback'
);

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];

// API Credentials
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const LOCATION = process.env.LOCATION || 'us-central1';

// Route imports
const authRoutes = require('./routes/auth');
const signRoutes = require('./routes/sign');
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
app.use('/browse', browseRoutes);

// OAuth Routes
app.get('/auth', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    if (req.session.user) {
        req.session.user.tokens = tokens;
        await User.findByIdAndUpdate(req.session.user._id, { tokens });
    }
    res.redirect('/moodTracker?authenticated=true');
});

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
app.get('/moodTracker', (req, res) => res.render('moodTracker'));

// Check Auth (AJAX-friendly)
app.get('/checkAuth', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user.username });
    } else {
        res.json({ success: false });
    }
});

// Mood Tracker Route with History
app.get('/moodTracker', async (req, res) => {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id);
        const moodHistory = user.moodHistory || [];
        res.render('index', { moodHistory });
    } else {
        res.redirect('/login');
    }
});

// Gemini API Proxy
app.post('/api/gemini', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await fetch(`https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.0-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GEMINI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.json(data.candidates[0].content.parts[0].text);
    } catch (error) {
        res.status(500).json({ error: 'Gemini API error' });
    }
});

// YouTube API Proxy
app.get('/api/youtube', async (req, res) => {
    const { q } = req.query;
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: YOUTUBE_API_KEY
        });
        const searchResponse = await youtube.search.list({
            part: 'snippet',
            q: q,
            maxResults: 1,
            type: 'video'
        });
        const videoId = searchResponse.data.items[0].id.videoId;
        const videoResponse = await youtube.videos.list({
            part: 'snippet,statistics',
            id: videoId
        });
        res.json(videoResponse.data.items[0]);
    } catch (error) {
        res.status(500).json({ error: 'YouTube API error' });
    }
});

// Socket.IO for Live Updates
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('updateLiveInsights', (songTitle) => {
        io.emit('liveInsights', { songTitle, message: `Updated insights for ${songTitle}` });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❗ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));