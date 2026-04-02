const express = require('express');
const router = express.Router();
const channelsController = require('../controllers/channels');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, channelsController.getAllChannels);
router.get('/search', authenticate, channelsController.searchPublicChannels);
router.get('/:channelId', authenticate, channelsController.getChannelInfo);
router.post('/', authenticate, channelsController.createChannel);
router.delete('/:channelId', authenticate, channelsController.deleteChannel);
router.patch('/:channelId/mute', authenticate, channelsController.toggleMute);
router.post('/:channelId/invite', authenticate, channelsController.inviteMember);
router.post('/:channelId/join', authenticate, channelsController.joinChannel);

router.get('/:channelId/notebook', authenticate, channelsController.getNotebook);
router.patch('/:channelId/notebook', authenticate, channelsController.updateNotebook);

module.exports = router;
