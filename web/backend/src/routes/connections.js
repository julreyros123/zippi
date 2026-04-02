const express = require('express');
const router = express.Router();
const { sendConnection, getMyConnections, removeConnection } = require('../controllers/connections');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getMyConnections);
router.post('/', authenticate, sendConnection);
router.delete('/:id', authenticate, removeConnection);

module.exports = router;
