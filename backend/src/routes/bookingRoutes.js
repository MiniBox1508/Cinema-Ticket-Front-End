const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { bookTickets } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', bookTickets);

module.exports = router;