const express = require('express');
const router = express.Router();
const { listEvents, createEvent, deleteEvent } = require('../controllers/events');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, listEvents);
router.post('/', authenticate, createEvent);
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;
