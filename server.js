// const express = require('express');
// const app = express();
// const path = require('path');
// const dotenv = require('dotenv');
// const connectDB = require('./db');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const User = require('./models/user');
// const sendEmail = require('./routes/email.service');

// // Import Routes
// const authRoutes = require('./routes/auth');
// const signRoutes = require('./routes/sign');
// const playRoutes = require('./routes/play');
// const forumRoutes = require('./routes/forum');

// // Database Connection
// connectDB();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your_secret_key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Set to true if using HTTPS
// }));

// app.get("/checkAuth", (req, res) => {
//     if (req.session.user) {
//         res.json({ success: true, user: req.session.user.username });
//     } else {
//         res.json({ success: false });
//     }
// });

// // Static Files
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/songs", express.static(path.join(__dirname, "public", "Songs")));

// // Set EJS as Templating Engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Global Middleware to pass user session data to all views
// app.use((req, res, next) => {
//     res.locals.user = req.session.user || null;  // Make user available in all views
//     next();
// });

// // Routes
// app.use('/login', authRoutes);
// app.use('/', signRoutes);

// app.use('/playlist', playRoutes);
// app.use('/forum', forumRoutes);

// // Home Page Route
// app.get("/", (req, res) => {
//     res.render("home");
// });



// // Logout Route
// app.get("/logout", (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/");
//     });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.error('❗ Error:', err.message);
//     res.status(500).json({ error: 'Internal Server Error' });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./db');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const sendEmail = require('./routes/email.service');


// Import Routes
const authRoutes = require('./routes/auth');
const signRoutes = require('./routes/sign');
const playRoutes = require('./routes/play');
const forumRoutes = require('./routes/forum');
const adminRoutes = require('./routes/admin');   // ✅ Added Admin Route
const profileRoutes = require('./routes/profile'); // ✅ Added Profile Route

// 🌐 Database Connection
connectDB();

// 🔹 Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Set to true if using HTTPS
}));

// ✅ Authentication Check Route
app.get("/checkAuth", (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user.username });
    } else {
        res.json({ success: false });
    }
});

// 📂 Serve Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/songs", express.static(path.join(__dirname, "public", "Songs")));

// 🎨 Set EJS as Templating Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🔹 Global Middleware (Pass user session data to views)
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 🔀 Routes
app.use('/login', authRoutes);
app.use('/', signRoutes);
app.use('/playlist', playRoutes);
app.use('/forum', forumRoutes);
app.use('/admin', adminRoutes);   // ✅ Added Admin Route
app.use('/', profileRoutes); // ✅ Added Profile Route

// 🏠 Home Page Route
app.get("/", (req, res) => {
    res.render("home");
});

// 🚪 Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// ⚠️ Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❗ Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
