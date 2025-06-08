const PaymentModel = require('../models/paymentModel');
const TicketModel = require('../models/ticketModel');
const { sql } = require('../config/db');

const bookTickets = async (req, res) => {
    let pool;
    try {
        const { tickets, payment } = req.body;
        console.log('Booking data:', { tickets, payment });

        pool = await sql.connect();

        // 1. Create payment first without transaction
        const paymentRequest = pool.request();
        paymentRequest.input('status', sql.NVarChar, 'paid');
        paymentRequest.input('amount', sql.Float, payment.amount);
        paymentRequest.input('method', sql.NVarChar, payment.paymentMethod);
        paymentRequest.input('userId', sql.Int, payment.userId);

        const paymentResult = await paymentRequest.query(`
            INSERT INTO Payments (PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId)
            OUTPUT INSERTED.PaymentId
            VALUES (@status, @amount, GETDATE(), @method, @userId)
        `);

        const paymentId = paymentResult.recordset[0].PaymentId;
        console.log('Payment created:', paymentId);

        // 2. Create tickets
        for (const ticket of tickets) {
            const ticketRequest = pool.request();
            ticketRequest.input('seatNumber', sql.NVarChar, ticket.seatNumber);
            ticketRequest.input('price', sql.Float, ticket.price);
            ticketRequest.input('showtime', sql.Int, parseInt(ticket.showtimeId));
            ticketRequest.input('userId', sql.Int, payment.userId);
            ticketRequest.input('paymentId', sql.Int, paymentId);

            await ticketRequest.query(`
                INSERT INTO Tickets (
                    SeatNumber,
                    BookingTime,
                    TotalPrice,
                    PaymentStatus,
                    UserId,
                    ShowtimeId,
                    PaymentId
                ) VALUES (
                    @seatNumber,
                    GETDATE(),
                    @price,
                    'paid',
                    @userId,
                    @showtime,
                    @paymentId
                )
            `);
        }

        res.status(201).json({
            success: true,
            message: 'Đặt vé thành công',
            paymentId: paymentId
        });

    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({
            success: false,
            error: 'Không thể đặt vé',
            details: err.message
        });
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

module.exports = {
    bookTickets
};

