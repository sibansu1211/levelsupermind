const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Post = mongoose.model('Post', {
  title: String,
  content: String
});

// Create a new post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  await newPost.save();
  res.status(201).json(newPost);
});

// Get all posts
app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Get a specific post
app.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.json(post);
  }
});

// Update a post
app.put('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
  if (!updatedPost) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.json(updatedPost);
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  const postId = req.params.id;
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    res.status(404).json({ error: 'Post not found' });
  } else {
    res.status(204).send();
  }
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
