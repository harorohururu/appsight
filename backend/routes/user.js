const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = (User) => {
  // Create admin user
  router.post('/', async (req, res) => {
    try {
      const { name, username, password } = req.body;
      if (!name || !username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, username, password: hashedPassword });
      res.status(201).json({ user_id: user.user_id, name: user.name, username: user.username });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username, password });
      if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ success: false, message: 'Username and password required.' });
      }
      const user = await User.findOne({ where: { username } });
      console.log('User found in DB:', user ? user.toJSON() : null);
      if (!user) {
        console.log('No user found for username:', username);
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
      const match = await bcrypt.compare(password, user.password);
      console.log('Password match:', match);
      if (!match) {
        console.log('Password does not match for user:', username);
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
      // Optionally, return user info (excluding password)
      const { user_id, name } = user;
      console.log('Login successful for user:', username);
      return res.json({ success: true, user: { user_id, name, username } });
    } catch (err) {
      console.log('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
  });

  // Get all users
  router.get('/', async (req, res) => {
    try {
      const users = await User.findAll({ attributes: ['user_id', 'name', 'username', 'created_at'] });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
