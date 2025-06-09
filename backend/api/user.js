const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

// CREATE a new user
router.post('/users', async (req, res) => {
    const { username, password, displayName } = req.body;

    if (!username || !password || !displayName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'already have this username' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            password: hashedPassword,
            displayName
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a user by username
router.delete('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;