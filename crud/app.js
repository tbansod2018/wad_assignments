// Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');

// Create Express application
const app = express();
const PORT = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb+srv://somesh:somesh@cluster0.mpdotw5.mongodb.net/wadlCRUD?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Create User model
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Register User API
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login User API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      // Generate token (for simplicity, let's assume token is just user's ID)
      const token = user._id;
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Show User Data API
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Update User Data API
app.put('/api/user/:userId', async (req, res) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, { username, email }, { new: true });
    if (updatedUser) {
      res.json({ message: 'User data updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
