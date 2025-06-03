const express = require('express');
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

module.exports = router;
