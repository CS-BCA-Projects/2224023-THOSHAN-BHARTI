const mongoose = require("mongoose");

const ForumPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, // Store email or username
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ForumPost", ForumPostSchema);
