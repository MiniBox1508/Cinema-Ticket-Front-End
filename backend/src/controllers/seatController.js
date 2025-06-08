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
        res.status(201).json({ 
            message: 'Tạo ghế thành công', 
            seatId: result.SeatId 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật thông tin ghế
const updateSeat = async (req, res) => {
    const { id } = req.params;
    const { SeatNumber, Line, RoomId } = req.body;
    try {
        const result = await SeatModel.update(id, { SeatNumber, Line, RoomId });
        if (!result) {
            return res.status(404).json({ message: 'Không tìm thấy ghế' });
        }
        res.json({ message: 'Cập nhật ghế thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
    const { RoomId } = req.params;
    try {
        console.log('Getting seats for room:', RoomId); // Debug log
        const seats = await SeatModel.getSeatsByRoomId(RoomId);
        
        if (!seats || seats.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy ghế nào trong phòng này'
            });
        }

        console.log('Found seats:', seats.length); // Debug log
        res.status(200).json(seats);
    } catch (err) {
        console.error('Error getting seats:', err);
        res.status(500).json({
            error: 'Không thể tải thông tin ghế',
            details: err.message
        });
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
