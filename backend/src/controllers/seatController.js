const SeatModel = require('../models/seatModel');

// Lấy danh sách tất cả các ghế
const getAllSeats = async (req, res) => {
    try {
        const seats = await SeatModel.getAll();
        res.status(200).json(seats);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách ghế', details: err });
    }
};

// Lấy thông tin chi tiết một ghế
const getSeatById = async (req, res) => {
    const { id } = req.params;
    try {
        const seat = await SeatModel.getById(id);
        if (!seat) {
            return res.status(404).json({ message: 'Ghế không tồn tại' });
        }
        res.status(200).json(seat);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy thông tin ghế', details: err });
    }
};

// Thêm một ghế mới
const createSeat = async (req, res) => {
    const { SeatNumber, Line, RoomId } = req.body;
    try {
        const result = await SeatModel.create({ SeatNumber, Line, RoomId });
        res.status(201).json({ message: 'Ghế đã được tạo thành công', seat: result });
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo ghế', details: err });
    }
};

// Cập nhật thông tin ghế
const updateSeat = async (req, res) => {
    const { id } = req.params;
    const { SeatNumber, Line, RoomId } = req.body;
    try {
        const result = await SeatModel.update(id, { SeatNumber, Line, RoomId });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ghế không tồn tại' });
        }
        res.status(200).json({ message: 'Cập nhật ghế thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật ghế', details: err });
    }
};

// Xóa một ghế
const deleteSeat = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SeatModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ghế không tồn tại' });
        }
        res.status(200).json({ message: 'Ghế đã bị xóa' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể xóa ghế', details: err });
    }
};
// Lấy ghế của một showtime
const getSeatsByRoomId = async (req, res) => {
    const { roomId } = req.params;
    try {
        const seats = await SeatModel.getSeatsByRoomId(roomId);
        if (seats.length === 0) {
            return res.status(404).json({ message: 'No seats found for this showtimeId' });
        }
        res.status(200).json(seats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch seats by showtimeId', details: err });
    }
};

module.exports = {
    getAllSeats,
    getSeatById,
    createSeat,
    updateSeat,
    deleteSeat,
    getSeatsByRoomId,
};
