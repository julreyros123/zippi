const express = require('express');
const router = express.Router();
const { listAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcements');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, listAnnouncements);
router.post('/', authenticate, createAnnouncement);
router.delete('/:id', authenticate, deleteAnnouncement);

module.exports = router;
