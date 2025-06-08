const express = require('express');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

// Sign Up
router.post('/signup', signup);

// Sign In
router.post('/signin', signin);

module.exports = router;
