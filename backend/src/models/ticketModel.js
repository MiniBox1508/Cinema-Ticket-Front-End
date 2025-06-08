const { sql } = require('../config/db');
const config = require('../config/db');

const TicketModel = {
    // Lấy danh sách tất cả vé
    getAll: async () => {
        const result = await sql.query`SELECT * FROM Tickets`; // Sửa từ Ticket thành Tickets
        return result.recordset;
    },

    // Lấy thông tin chi tiết một vé
    getById: async (id) => {
        const result = await sql.query`SELECT * FROM Tickets WHERE TicketId = ${id}`;
        return result.recordset[0];
    },

    // Thêm một vé mới
    create: async (ticket) => {
        const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = ticket;
        const result = await sql.query`
            INSERT INTO Tickets (
                SeatNumber, BookingTime, TotalPrice, 
                PaymentStatus, UserId, ShowtimeId, PaymentId
            ) VALUES (
                ${SeatNumber}, ${BookingTime}, ${TotalPrice}, 
                ${PaymentStatus}, ${UserId}, ${ShowtimeId}, ${PaymentId}
            );
            SELECT SCOPE_IDENTITY() AS TicketId;
        `;
        return result.recordset[0];
    },

    // Cập nhật thông tin vé
    update: async (id, ticket) => {
        const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = ticket;
        const result = await sql.query`
            UPDATE Tickets 
            SET 
                SeatNumber = ${SeatNumber}, 
                BookingTime = ${BookingTime}, 
                TotalPrice = ${TotalPrice}, 
                PaymentStatus = ${PaymentStatus}, 
                UserId = ${UserId}, 
                ShowtimeId = ${ShowtimeId}, 
                PaymentId = ${PaymentId} 
            WHERE TicketId = ${id};
        `;
        return result.rowsAffected[0] > 0;
    },

    // Xóa một vé
    delete: async (id) => {
        const result = await sql.query`DELETE FROM Tickets WHERE TicketId = ${id}`;
        return result.rowsAffected[0] > 0;
    },

    // Lấy vé được đặt bởi một người
    getByUserEmail: async (email) => {
        const result = await sql.query`
            SELECT 
                t.TicketId, t.SeatNumber, t.BookingTime, 
                t.TotalPrice, t.PaymentStatus, m.Title AS MovieTitle, 
                s.StartTime AS Showtime, r.Name AS RoomName, 
                th.Name AS TheaterName
            FROM Ticket t
            INNER JOIN Users u ON t.UserId = u.UserId
            INNER JOIN Showtime s ON t.ShowtimeId = s.ShowtimeId
            INNER JOIN Movie m ON s.MovieId = m.MovieId
            INNER JOIN Room r ON s.RoomId = r.RoomId
            INNER JOIN Theater th ON s.TheaterId = th.TheaterId
            WHERE u.Email = ${email}
            ORDER BY t.BookingTime DESC
        `;
        return result.recordset;
    },

    getTicketsByShowtimeId: async (showtimeId) => {
        const result = await sql.query`
            SELECT TicketId, UserId, SeatNumber, TotalPrice, 
                   PaymentStatus, BookingTime
            FROM Ticket
            WHERE ShowtimeId = ${showtimeId}
            AND PaymentStatus IN ('paid', 'pending')
        `;
        return result.recordset;
    },

    // Thêm hàm để lấy ghế đã đặt theo showtime
    getBookedSeatsByShowtime: async (showtimeId) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('showtimeId', sql.Int, showtimeId);

            const query = `
                SELECT DISTINCT
                    s.SeatId,
                    s.SeatNumber, 
                    s.Line,
                    s.RoomId
                FROM Seats s
                INNER JOIN Tickets t ON s.SeatNumber = t.SeatNumber  
                INNER JOIN Showtimes sh ON t.ShowtimeId = sh.ShowtimeId
                WHERE t.ShowtimeId = @showtimeId
                AND s.RoomId = sh.RoomId
                AND t.PaymentStatus IN ('paid', 'pending')
            `;

            const result = await request.query(query);
            return result.recordset;

        } catch (error) {
            console.error('Error in getBookedSeatsByShowtime:', error);
            throw error;
        }
    },

    // Hàm để lấy giá vé theo showtime
    getTicketPrice: async (showtimeId) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('showtimeId', sql.Int, showtimeId);

            const query = `
                SELECT Price
                FROM Showtimes
                WHERE ShowtimeId = @showtimeId
            `;

            const result = await request.query(query);
            return result.recordset[0]?.Price || 0;
        } catch (error) {
            console.error('Error getting ticket price:', error);
            throw error;
        }
    }
};

module.exports = TicketModel;
