const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const connectDB = require('./db'); 
const authRoutes = require('./routes/auth'); 
const signRoutes = require('./routes/sign'); 
const logoutRoute = require('./routes/logout'); 
const playRoutes = require('./routes/play'); 
const session = require('express-session');
const cookieParser = require('cookie-parser');
const axios = require('axios');





// Import Data (run only once manually)
// const importData = require('./importData');
// importData().catch(err => {
//     console.error('❗ Data import error:', err);
// });

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files (for CSS, images, etc.)


// Routes
app.use('/login', authRoutes);
app.use('/signup', signRoutes);
app.use('/', logoutRoute);  
app.use('/', playRoutes);

// Main Pages
app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));

app.get('/playlist', async (req, res) => {
    const genreFilter = req.query.genre;
    let query = {};

    if (genreFilter && genreFilter !== 'All') {
        query = { Genre: { $regex: new RegExp(genreFilter, 'i') } };
    }

    const musicData = await Music.find(query);

    res.render('playlist', { 
        musicData, 
        genreFilter 
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❗ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
