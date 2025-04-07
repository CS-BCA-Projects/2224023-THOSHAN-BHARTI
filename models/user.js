// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     username: { type: String, required: true, unique: true },
// });

// // Prevent model overwrite error
// const User = mongoose.models.User || mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  favorites: [{
    title: String,
    filename: String
}],

});

module.exports = mongoose.model("User", userSchema);
