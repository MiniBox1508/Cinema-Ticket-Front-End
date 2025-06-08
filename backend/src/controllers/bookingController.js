const PaymentModel = require('../models/paymentModel');
const TicketModel = require('../models/ticketModel');
const { sql } = require('../config/db');

const bookTickets = async (req, res) => {
    let pool;
    let paymentResult = null;
    try {
        const { tickets, payment } = req.body;
        console.log('Booking data:', { tickets, payment });

        // Create payment first
        paymentResult = await PaymentModel.create({
            PaymentStatus: 'completed',
            Amount: payment.amount,
            PaymentTime: new Date(),
            PaymentMethod: payment.paymentMethod,
            UserId: payment.userId
        });

        console.log('Payment created:', paymentResult.PaymentId);

        // Then create all tickets (each ticket is a row in Tickets)
        const ticketPromises = tickets.map(ticket =>
            TicketModel.create({
                SeatNumber: ticket.seatNumber,
                BookingTime: new Date(),
                TotalPrice: ticket.price,
                PaymentStatus: 'paid',
                UserId: payment.userId,
                ShowtimeId: parseInt(ticket.showtimeId),
                PaymentId: paymentResult.PaymentId
            })
        );

        // Wait for all tickets to be created and get their results
        const createdTickets = await Promise.all(ticketPromises);

        // Send success response with all tickets
        res.status(201).json({
            success: true,
            message: 'Đặt vé thành công',
            paymentId: paymentResult.PaymentId,
            tickets: createdTickets.map((ticket, idx) => ({
                ticketId: ticket.TicketId,
                seatNumber: tickets[idx].seatNumber,
                price: tickets[idx].price
            }))
        });

    } catch (err) {
        console.error('Booking error:', err);

        // Handle SQL Server Agent error
        if (err.number === 22022) {
            if (paymentResult?.PaymentId) {
                return res.status(201).json({
                    success: true,
                    message: 'Đặt vé thành công (với cảnh báo SQL Server Agent)',
                    paymentId: paymentResult.PaymentId
                });
            }
        }

        res.status(500).json({
            success: false,
            error: 'Không thể đặt vé',
            details: err.message
        });
    }
};

module.exports = {
    bookTickets
};

