const express = require('express');
const {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByUserEmail,
    getTicketsByShowtimeId,
    getBookedSeatsByShowtime,
} = require('../controllers/ticketController');

const router = express.Router();

// Base URL: /api/tickets

// GET /api/tickets/user/:email - Lấy vé theo email người dùng
router.get('/user/:email', getTicketsByUserEmail);

// GET /api/tickets/showtime/:showtimeId - Lấy vé theo suất chiếu
router.get('/showtime/:showtimeId', getTicketsByShowtimeId);

// GET /api/tickets/showtime/:showtimeId/booked-seats - Lấy danh sách ghế đã đặt của một suất chiếu
router.get('/showtime/:showtimeId/booked-seats', getBookedSeatsByShowtime);

// GET /api/tickets - Lấy tất cả vé
router.get('/', getAllTickets);

// GET /api/tickets/:id - Lấy chi tiết một vé
router.get('/:id', getTicketById);

// POST /api/tickets - Tạo vé mới 
router.post('/', createTicket);

// PUT /api/tickets/:id - Cập nhật thông tin vé
router.put('/:id', updateTicket);

// DELETE /api/tickets/:id - Xóa một vé
router.delete('/:id', deleteTicket);


module.exports = router;
