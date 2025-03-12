// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');


// const path = require('path');
// const dotenv = require('dotenv');
// dotenv.config({ path: './.env' });

// // Set up EJS as the templating engine
// app.set('view engine', 'ejs');

// // Define the path for views
// app.set('views', path.join(__dirname, 'views'));

// // Initialize express app
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Connect to MongoDB Atlas
// mongoose.connect('mongodb+srv://thoshansbg2005:healingsystem123@cluster0.c3rpl.mongodb.net', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

//   .then(() => console.log('Connected to MongoDB Atlas'))
//   .catch((err) => console.log('Error connecting to MongoDB: ', err));

// // Define the user schema and model
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model('User', userSchema);

// // Create a POST route to handle form submissions
// app.post('/register', (req, res) => {
//   const { email, password } = req.body;

//   const newUser = new User({ email, password });

//   newUser.save()
//     .then(() => res.send('User registered successfully!'))
//     .catch((err) => res.status(400).send('Error registering user: ' + err));
// });

// // Serve the frontend
// app.use(express.static('public'));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Initialize express app
const app = express();

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Define the path for views
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://thoshansbg2005:healingsystem123@cluster0.c3rpl.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

// Define the user schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('reg', userSchema);

// Create a POST route to handle form submissions
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const newUser = new reg({ email, password });

  newUser.save()
    .then(() => res.send('User registered successfully!'))
    .catch((err) => res.status(400).send('Error registering user: ' + err));
});

// Serve the frontend (static files like HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
