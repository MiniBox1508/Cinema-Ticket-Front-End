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
    const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = req.body;
    try {
        const result = await TicketModel.create({ SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId });
        res.status(201).json({ message: 'Ticket created successfully', ticket: result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket', details: err });
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
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this showtimeId' });
        }
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets by showtimeId', details: err });
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
};
