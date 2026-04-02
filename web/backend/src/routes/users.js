const express = require('express');
const router = express.Router();
const { listUsers, updateProfile } = require('../controllers/users');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, listUsers);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
