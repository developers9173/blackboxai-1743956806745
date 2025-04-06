const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// Protected chat routes (require authentication)
router.post('/messages', authMiddleware, chatController.sendMessage);
router.get('/messages', authMiddleware, chatController.getChatHistory);
router.get('/messages/user', authMiddleware, chatController.getMessagesByUser);

module.exports = router;