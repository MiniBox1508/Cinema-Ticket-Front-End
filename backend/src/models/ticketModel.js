const db = require('../config/db');

const TicketModel = {
    // Lấy danh sách tất cả vé
    getAll: () => {
        const query = 'SELECT * FROM Tickets';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Lấy thông tin chi tiết một vé
    getById: (id) => {
        const query = 'SELECT * FROM Tickets WHERE TicketId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    // Thêm một vé mới
    create: (ticket) => {
        const query = 'INSERT INTO Tickets (SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = ticket;
        return new Promise((resolve, reject) => {
            db.query(query, [SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Cập nhật thông tin vé
    update: (id, ticket) => {
        const query = 'UPDATE Tickets SET SeatNumber = ?, BookingTime = ?, TotalPrice = ?, PaymentStatus = ?, UserId = ?, ShowtimeId = ?, PaymentId = ? WHERE TicketId = ?';
        const { SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId } = ticket;
        return new Promise((resolve, reject) => {
            db.query(query, [SeatNumber, BookingTime, TotalPrice, PaymentStatus, UserId, ShowtimeId, PaymentId, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Xóa một vé
    delete: (id) => {
        const query = 'DELETE FROM Tickets WHERE TicketId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Lấy vé được đặt bởi một người
    getByUserEmail: (email) => {
        const query = `
            SELECT 
                t.TicketId, 
                t.SeatNumber, 
                t.BookingTime, 
                t.TotalPrice, 
                t.PaymentStatus, 
                m.Title AS MovieTitle, 
                s.StartTime AS Showtime, 
                r.Name AS RoomName, 
                th.Name AS TheaterName
            FROM 
                Tickets t
            INNER JOIN 
                Users u ON t.UserId = u.UserId
            INNER JOIN 
                Showtimes s ON t.ShowtimeId = s.ShowtimeId
            INNER JOIN 
                Movies m ON s.MovieId = m.MovieId
            INNER JOIN 
                Room r ON s.RoomId = r.RoomId
            INNER JOIN 
                Theaters th ON s.TheaterId = th.TheaterId
            WHERE 
                u.Email = ?
            ORDER BY 
                t.BookingTime DESC;
    `;
        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    getTicketsByShowtimeId: (showtimeId) => {
        const query = `
            SELECT 
                TicketId,
                UserId,
                SeatNumber,
                TotalPrice,
                PaymentStatus,
                BookingTime
            FROM 
                Tickets
            WHERE 
                ShowtimeId = ?
                AND PaymentStatus IN ('paid', 'pending');
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [showtimeId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = TicketModel;
