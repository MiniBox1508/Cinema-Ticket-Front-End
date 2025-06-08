const express = require('express');
const {
    getAllSeats,
    getSeatById,
    createSeat,
    updateSeat,
    deleteSeat,
    getSeatsByRoomId,
} = require('../controllers/seatController');

const router = express.Router();

// Make sure this route is defined before more specific routes
router.get('/room/:RoomId', getSeatsByRoomId);
router.get('/', getAllSeats);
router.get('/:id', getSeatById);
router.post('/', createSeat);
router.put('/:id', updateSeat);
router.delete('/:id', deleteSeat);

module.exports = router;
