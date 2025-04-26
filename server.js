const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./db');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/user');
const Songs = require('./models/song'); // Import the Songs model
dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

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

// Views and Static Files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/Song", express.static(path.join(__dirname, "public", "Songs")));

// Session in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// OAuth2 Config
const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);

const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Route Imports
const authRoutes = require('./routes/auth');
const signRoutes = require('./routes/sign');
const playRoutes = require('./routes/play');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const browseRoutes = require('./routes/browse');
const libraryRoutes = require('./routes/library');
const authsRoutes = require('./routes/Auths');
const apiRoutes = require('./routes/api'); // ✅ Gemini AI route file
const { isLoggedIn} = require('./middleware/auth');

// Use Routes
app.use('/login', authRoutes);
app.use('/signup', signRoutes);
app.use('/playlist', playRoutes);
app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/browse', browseRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api', apiRoutes); // ✅ mounts Gemini logic
app.use('/', authsRoutes);

// Views
app.get('/', (req, res) => res.render('home'));
app.get('/relax', (req, res) => res.render('relax'));
app.get('/playlist', async (req, res) => {
  try {
    const sounds = await Songs.find(); // Fetch dynamic songs from MongoDB
    res.render('playlist', { sounds });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.render('playlist', { sounds: [] }); // Pass an empty array if there's an error
  }
});
app.get('/library', (req, res) => res.render('library'));

app.get('/logout', (req, res) => {

  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ message: 'Failed to log out. Please try again.' });
    }
    
    res.clearCookie('connect.sid', { path: '/' });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.redirect('/login');
  });
});

app.get('/moodTracker', isLoggedIn, async (req, res) => {
  try {
    const dbUser = await User.findById(req.session.user._id);
    const moodHistory = dbUser?.moodHistory || [];
    res.render('moodTracker', { user: req.session.user, moodHistory });
  } catch (err) {
    console.error("Error loading moodTracker:", err);
    res.redirect('/login');
  }
});

// OAuth Flow
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

// YouTube Proxy
app.get('/api/youtube', async (req, res) => {
  try {
    const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_API_KEY });
    const searchResponse = await youtube.search.list({
      part: 'snippet',
      q: req.query.q,
      maxResults: 1,
      type: 'video'
    });
    const videoId = searchResponse.data.items[0]?.id.videoId;
    const videoDetails = await youtube.videos.list({
      part: 'snippet,statistics',
      id: videoId
    });
    res.json(videoDetails.data.items[0]);
  } catch (error) {
    res.status(500).json({ error: 'YouTube API error' });
  }
});

// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('updateLiveInsights', (songTitle) => {
    io.emit('liveInsights', { songTitle, message: `Updated insights for ${songTitle}` });
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

