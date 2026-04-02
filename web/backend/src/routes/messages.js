const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:channelId/messages', authenticate, messagesController.getChannelMessages);
router.post('/:channelId/messages', authenticate, upload.single('file'), messagesController.createMessage);
router.put('/:channelId/messages/:messageId', authenticate, messagesController.editMessage);
router.delete('/:channelId/messages/:messageId', authenticate, messagesController.deleteMessage);

module.exports = router;
