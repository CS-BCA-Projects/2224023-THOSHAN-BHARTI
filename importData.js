const mongoose = require('mongoose');
const Music = require('./models/musics'); // Ensure the correct path
const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB Connected Successfully'))
.catch(err => console.error('❗ MongoDB Connection Error:', err));

const importData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('./data/musicdata.jason', 'utf-8'));
        await Music.deleteMany();  // Clears old data before importing
        await Music.insertMany(data);
        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error(`Data Import Error: ${error}`);
        process.exit(1);
    }
};

importData();
