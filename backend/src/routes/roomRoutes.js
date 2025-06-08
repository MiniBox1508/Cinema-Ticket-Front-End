const express = require('express');
const RoomModel = require('../models/roomModel');
const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} = require('../controllers/roomController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.get('/showtime/:showtimeId', async (req, res) => {
    try {
        const rooms = await RoomModel.getRoomsByShowtime(req.params.showtimeId);
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy phòng cho suất chiếu này' });
        }
        res.json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
