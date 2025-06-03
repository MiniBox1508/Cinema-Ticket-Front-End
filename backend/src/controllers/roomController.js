const RoomModel = require('../models/roomModel');

// Lấy danh sách tất cả các phòng
const getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomModel.getAll();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms', details: err });
    }
};

// Lấy thông tin phòng theo ID
const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await RoomModel.getById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch room', details: err });
    }
};

// Thêm một phòng mới
const createRoom = async (req, res) => {
    const { TotalSeat, Name, TheaterId } = req.body;
    const room = { TotalSeat, Name, TheaterId };
    try {
        const result = await RoomModel.create(room);
        res.status(201).json({ message: 'Room created successfully', roomId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create room', details: err });
    }
};

// Cập nhật thông tin phòng
const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { TotalSeat, Name, TheaterId } = req.body;
    const room = { TotalSeat, Name, TheaterId };
    try {
        const result = await RoomModel.update(id, room);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update room', details: err });
    }
};

// Xóa một phòng
const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await RoomModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete room', details: err });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
};
