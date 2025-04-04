const mongoose = require('mongoose');
const Songs = require('./models/Songs'); // Ensure the correct path


const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB Connected Successfully'))
.catch(err => console.error('❗ MongoDB Connection Error:', err));

const songs = [
    { title: "Calm Melody", artist: "Healing Sounds", genre: "Calm", fileUrl: "/songs/calm-melody.mp3" },
    { title: "Cheerful Mood", artist: "Happy Beats", genre: "Cheerful", fileUrl: "/songs/cheerful-mood.mp3" },
    { title: "Deep Sleep", artist: "Sleep Sounds", genre: "Sleep", fileUrl: "/songs/deep-sleep.mp3" },
  ];
  
  Songs.insertMany(Songs)
    .then(() => {
      console.log("✅ Songs added to MongoDB!");
      mongoose.connection.close();
    })
    .catch((error) => console.error("❌ Error inserting songs:", error));
importData();
