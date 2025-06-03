const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Sign Up
router.post('/signup', authController.signup);

// Sign In
router.post('/signin', authController.signin);

// Sign In
router.post('/signin/admin', authController.adminSignin);

// Sign Out
router.post('/signout', authController.signout);

module.exports = router;
