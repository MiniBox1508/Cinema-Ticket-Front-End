const { sql } = require('../config/db');

// Lấy danh sách tất cả các phòng
const getAllRooms = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Room`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin phòng theo ID
const getRoomById = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT * FROM Room WHERE RoomID = ${req.params.id}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm một phòng mới
const createRoom = async (req, res) => {
    const { name, capacity, theaterId } = req.body;
    try {
        const result = await sql.query`
            INSERT INTO Room (Name, Capacity, TheaterId) 
            VALUES (${name}, ${capacity}, ${theaterId});
            SELECT SCOPE_IDENTITY() AS RoomID;
        `;
        res.status(201).json({ 
            message: 'Tạo phòng thành công', 
            roomId: result.recordset[0].RoomID 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật thông tin phòng
const updateRoom = async (req, res) => {
    const { name, capacity, theaterId } = req.body;
    try {
        const result = await sql.query`
            UPDATE Room 
            SET Name = ${name}, 
                Capacity = ${capacity}, 
                TheaterId = ${theaterId} 
            WHERE RoomID = ${req.params.id}
        `;
        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Cập nhật phòng thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Xóa một phòng
const deleteRoom = async (req, res) => {
    try {
        const result = await sql.query`
            DELETE FROM Room WHERE RoomID = ${req.params.id}
        `;
        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Xóa phòng thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy phòng' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};
