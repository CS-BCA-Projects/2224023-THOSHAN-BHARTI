const express = require('express');
const router = express.Router();
const Post = require('../models/forumpost');
const Comment = require('../models/comment');
const { isAuthenticated } = require('../middlewares/auth');  // Ensure you have this middleware to check if the user is logged in

// Forum Page - Show all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });  // Fetch posts in descending order of date
    res.render('forum', { posts }); // Render the forum page with all posts
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create New Post Page - Show form to create a new post (requires authentication)
router.get('/newPost', isAuthenticated, (req, res) => {
    res.render('newPost'); // Render the 'newPost' template to create a post
});

// Create a New Post - Handles the form submission for creating a post
router.post('/create', isAuthenticated, async (req, res) => {
  const { title, body } = req.body;
  const newPost = new Post({ title, body, author: req.session.user.username }); // Assuming user has a 'username'
  
  try {
    await newPost.save(); // Save the post to the database
    res.redirect('/forum');  // Redirect back to the forum page after post creation
  } catch (err) {
    res.status(500).send(err);
  }
});

// Show Individual Post Page - View details of a specific post
router.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const post = await Post.findById(id); // Fetch the post by ID
    const comments = await Comment.find({ postId: id }); // Fetch comments associated with this post
    res.render('post', { post, comments }); // Render the post view with the post and comments
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add a Comment to a Post - Post a new comment on a specific post
router.post('/post/:id/comment', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  const newComment = new Comment({
    postId: id,
    content,
    author: req.session.user.username // Assuming you have the username stored in the session
  });
  
  try {
    await newComment.save(); // Save the comment to the database
    res.redirect(`/forum/post/${id}`); // Redirect back to the individual post page after comment is added
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
