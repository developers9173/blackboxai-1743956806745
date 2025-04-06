const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { content, media } = req.body;
        const message = new Message({
            sender: req.user._id,
            content,
            media
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'username profilePicture')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get messages by user
exports.getMessagesByUser = async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.user._id })
            .populate('sender', 'username profilePicture');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};