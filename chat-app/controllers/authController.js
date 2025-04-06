const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        res.status(201).json({ 
            user: { 
                id: user._id, 
                username: user.username,
                profilePicture: user.profilePicture
            },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update status to online
        user.status = 'online';
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        res.json({ 
            user: { 
                id: user._id, 
                username: user.username,
                profilePicture: user.profilePicture,
                status: user.status
            },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout user
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.status = 'offline';
            await user.save();
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -blockedUsers');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};