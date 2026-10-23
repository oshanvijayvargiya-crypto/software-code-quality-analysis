const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST /auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET /auth/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, authController.getMe);

module.exports = router;
