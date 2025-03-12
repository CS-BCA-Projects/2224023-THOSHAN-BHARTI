const mongoose = require ('mongoose');
const DB_Name = 'SoundscapeSystem';
//const fs = require('fs')// 
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log(`MongoDB Connected ! DB Host : ${conn.connection.host}`);
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
module.exports = connectDB;


