const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.registerValidation, authController.register);
router.post('/login', authController.loginValidation, authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/password', authenticate, authController.updatePassword);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/forgot-password', authController.forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password', authController.resetPasswordValidation, authController.resetPassword);

module.exports = router;
