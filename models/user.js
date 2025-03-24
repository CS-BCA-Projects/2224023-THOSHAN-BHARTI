const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // For security, ensure password is hashed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
