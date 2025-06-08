//bookingModel o day

const { sql } = require('../config/db');

const bookingModel = {
    // Tạo vé mới
    create: async ({ RoomId, ShowtimeId, SeatId, UserId, Status = 'pending' }) => {
        const result = await sql.query`
            INSERT INTO Tickets (RoomId, ShowtimeId, SeatId, UserId, Status) 
            VALUES (${RoomId}, ${ShowtimeId}, ${SeatId}, ${UserId}, ${Status});
            SELECT SCOPE_IDENTITY() AS TicketId;
        `;
        return result.recordset[0];
    },

    // Cập nhật trạng thái ghế
    updateSeatStatus: (seatIds, status) => {
        const query = `
            UPDATE Seats
            SET Status = ?
            WHERE SeatId IN (?)
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [status, seatIds], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Cập nhật trạng thái thanh toán
    updatePaymentStatus: (ticketId, status) => {
        const query = 'UPDATE Tickets SET PaymentStatus = ? WHERE TicketId = ?';  // Chuyển từ Bookings sang Tickets
        return new Promise((resolve, reject) => {
            db.query(query, [status, ticketId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = bookingModel;
