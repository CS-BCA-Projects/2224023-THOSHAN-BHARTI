const express = require('express');
const connectDB = require('./db/index');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Define the path for views
app.set('views', path.join(__dirname, 'views'));



// MongoDB connection URI (replace <your-connection-string> with your actual MongoDB URI)
// Local MongoDB setup
// Or for MongoDB Atlas:
// const dbURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority';

app.get('/', (req, res) => {
    res.send('MongoDB Connection Example');
});


app.get('/index',(req,res)=>{
    res.render('index')
})
app.get('/playlist', (req, res) => {
    res.render('playlist')
});
app.get('/create',(req,res)=>{
    res.render('create')
})
app.get('/admin',(req,res)=>{
    res.render('admin')
})
app.get('/login',(req,res)=>{
    res.render('login')
})

// Routes for CRUD operations
app.get('/api/playlists', (req, res) => {
    db.query('SELECT * FROM playlists', (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch playlists' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/playlists', (req, res) => {
    const { name, category, description } = req.body;
    db.query(
        'INSERT INTO playlists (name, category, description) VALUES (?, ?, ?)',
        [name, category, description],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Failed to create playlist' });
                return;
            }
            res.status(201).json({ message: 'Playlist created' });
        }
    );
});

app.put('/api/playlists/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, description } = req.body;
    db.query(
        'UPDATE playlists SET name = ?, category = ?, description = ? WHERE id = ?',
        [name, category, description, id],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Failed to update playlist' });
                return;
            }
            res.json({ message: 'Playlist updated' });
        }
    );
});

app.delete('/api/playlists/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM playlists WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete playlist' });
            return;
        }
        res.json({ message: 'Playlist deleted' });
    });
});



// Route: Display Login Form
// app.get('/', (req, res) => {
//     res.render('login');
// });

// // Route: Handle Form Submission (Insert Data)
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         return res.status(400).send("❗ Username and password are required.");
//     }

//     try {
//         const existingUser = await collection.findOne({ username });

//         if (existingUser) {
//             res.send("🚨 User already exists! Please log in.");
//         } else {
//             await collection.insertOne({ username, password });
//             res.send("✅ Registration successful!");
//         }
//     } catch (error) {
//         console.error("❌ Error inserting data:", error);
//         res.status(500).send("❌ Internal server error");
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
// });
connectDB()
   .then(() => {
       app.listen(process.env.PORT, () => {
            console.log(`Server is running on http:localhost:${process.env.PORT}`);
       });
}).catch((err) =>{
    console.error(err);
})
