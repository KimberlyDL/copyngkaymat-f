const express = require('express');
const router = express.Router();
const chatbotController = require('../controller/ChatbotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/ask', protect, chatbotController.askChatbot);

module.exports = router;