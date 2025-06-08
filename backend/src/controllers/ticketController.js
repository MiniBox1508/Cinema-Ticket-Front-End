const TicketModel = require('../models/ticketModel');

// Lấy danh sách tất cả vé
const getAllTickets = async (req, res) => {
    try {
        const tickets = await TicketModel.getAll();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets', details: err });
    }
};

// Lấy thông tin chi tiết một vé
const getTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await TicketModel.getById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ticket', details: err });
    }
};

// Thêm một vé mới
const createTicket = async (req, res) => {
    const ticketData = req.body;
    try {
        const result = await TicketModel.create(ticketData);
        res.status(201).json({ 
            message: 'Tạo vé thành công', 
            ticketId: result.TicketId 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật thông tin vé
const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = req.body;
    try {
        const result = await TicketModel.update(id, { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ticket', details: err });
    }
};

// Xóa một vé
const deleteTicket = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await TicketModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete ticket', details: err });
    }
};

const getTicketsByUserEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const tickets = await TicketModel.getByUserEmail(email);
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this email' });
        }
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets by email', details: err });
    }
};

const getTicketsByShowtimeId = async (req, res) => {
    const { showtimeId } = req.params;
    try {
        const tickets = await TicketModel.getTicketsByShowtimeId(showtimeId);
        if (!tickets.length) {
            return res.status(404).json({ message: 'Không tìm thấy vé cho suất chiếu này' });
        }
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm hàm mới để lấy ghế đã đặt theo suất chiếu
const getBookedSeatsByShowtime = async (req, res) => {
    const { showtimeId } = req.params;
    
    try {
        const bookedSeats = await TicketModel.getBookedSeatsByShowtime(showtimeId);
        
        res.status(200).json(bookedSeats);
    } catch (err) {
        console.error('Error getting booked seats:', err);
        res.status(500).json({
            error: 'Không thể lấy thông tin ghế đã đặt',
            details: err.message
        });
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByUserEmail,
    getTicketsByShowtimeId,
    getBookedSeatsByShowtime,
};
