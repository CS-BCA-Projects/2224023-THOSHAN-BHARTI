const mongoose = require('mongoose');
const DB_NAME = 'harmonydb'
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`, {
            
        });
        console.log('MongoDB Atlas connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};


module.exports = connectDB;
