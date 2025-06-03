const express = require('express');
const {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsByUserEmail,
    getTicketsByShowtimeId,
} = require('../controllers/ticketController');

const router = express.Router();

// Lấy ticket được đặt bởi một người
router.get('/user/:email', getTicketsByUserEmail);
router.get('/showtime/:showtimeId', getTicketsByShowtimeId)
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);


module.exports = router;
