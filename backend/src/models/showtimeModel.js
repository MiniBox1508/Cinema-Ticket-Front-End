const sql = require('mssql');
const config = require('../config/db');

const ShowtimeModel = {
    getAll: () => {
        const query = 'SELECT * FROM Showtimes';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getById: (id) => {
        const query = 'SELECT * FROM Showtimes WHERE ShowtimeId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    create: (showtime) => {
        const query = 'INSERT INTO Showtimes (StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const { StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId } = showtime;
        return new Promise((resolve, reject) => {
            db.query(query, [StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    update: (id, showtime) => {
        const query = 'UPDATE Showtimes SET StartTime = ?, EndTime = ?, SeatStatus = ?, Price = ?, TheaterId = ?, RoomId = ?, MovieId = ? WHERE ShowtimeId = ?';
        const { StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId } = showtime;
        return new Promise((resolve, reject) => {
            db.query(query, [StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    delete: (id) => {
        const query = 'DELETE FROM Showtimes WHERE ShowtimeId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getShowtimesForMovieByLocationAndTimeRange: (movieId, location, startTime, endTime) => {
        const query = `
            SELECT s.ShowtimeId, s.StartTime, s.EndTime, s.Price, 
                   t.TheaterId, t.Name AS TheaterName, t.Location, 
                   r.RoomId, r.Name AS RoomName
            FROM Showtimes s
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            JOIN Room r ON s.RoomId = r.RoomId
            WHERE s.MovieId = ?
              AND t.Location = ?
              AND s.StartTime >= ?
              AND s.StartTime <= ?               
            ORDER BY s.StartTime
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [movieId, location, startTime, endTime], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getShowtimesForMovieByTimeRange: (movieId, startTime, endTime) => {
        const query = `
            SELECT s.ShowtimeId, s.StartTime, s.EndTime, s.Price, 
                   t.TheaterId, t.Name AS TheaterName, t.Location, 
                   r.RoomId, r.Name AS RoomName
            FROM Showtimes s
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            JOIN Room r ON s.RoomId = r.RoomId
            WHERE s.MovieId = ?
              AND s.StartTime >= ?              
            ORDER BY s.StartTime
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [movieId, startTime], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getShowtimesForMovieInThreeDaysInLocation: (movieId, location) => {
        const query = `
            SELECT s.ShowtimeId, s.StartTime, s.EndTime, s.Price, s.SeatStatus, t.Name AS TheaterName, r.Name AS RoomName
            FROM Showtimes s
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            JOIN Room r ON s.RoomId = r.RoomId
            WHERE s.MovieId = ? 
            AND t.Location = ? 
            AND s.StartTime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY);
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [movieId, location], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getShowtimesForMovieInThreeDays: (movieId) => {
        const query = `
            SELECT s.ShowtimeId, s.StartTime, s.EndTime, s.Price, s.SeatStatus, t.Name AS TheaterName, r.Name AS RoomName, t.Location
            FROM Showtimes s
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            JOIN Room r ON s.RoomId = r.RoomId
            WHERE s.MovieId = ? 
            AND s.StartTime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY);
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [movieId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getShowtimesByTheaterAndMovie: async (theaterId, movieId) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            
            request.input('theaterId', sql.Int, theaterId);
            request.input('movieId', sql.Int, movieId);

            const query = `
                SELECT DISTINCT
                    s.ShowtimeId,
                    s.StartTime,
                    s.EndTime, 
                    s.Price,
                    s.SeatStatus,
                    m.Title as MovieTitle,
                    t.Name as TheaterName,
                    r.RoomId,
                    r.Name as RoomName
                FROM Showtimes s
                INNER JOIN Movies m ON s.MovieId = m.MovieId
                INNER JOIN Theaters t ON s.TheaterId = t.TheaterId
                INNER JOIN Room r ON s.RoomId = r.RoomId
                WHERE s.TheaterId = @theaterId 
                AND s.MovieId = @movieId
                AND s.StartTime > DATEADD(HOUR, -3, s.StartTime) -- Chỉ lấy suất chiếu trong khoảng 3 tiếng trước
                ORDER BY s.StartTime ASC`;

            const result = await request.query(query);
            console.log('Found showtimes:', result.recordset.length);
            return result.recordset;

        } catch (error) {
            console.error('Error in getShowtimesByTheaterAndMovie:', error);
            throw error;
        }
    },

    getRoomsByShowtimeId: async (showtimeId) => {
        try {
            const pool = await sql.connect();
            const request = pool.request();
            
            request.input('showtimeId', sql.Int, showtimeId);

            const query = `
                SELECT DISTINCT
                    r.RoomId,
                    r.Name as RoomName,
                    r.TotalSeat,
                    t.Name as TheaterName,
                    s.StartTime,
                    s.EndTime
                FROM Room r
                INNER JOIN Theaters t ON r.TheaterId = t.TheaterId
                INNER JOIN Showtimes s ON r.RoomId = s.RoomId
                WHERE s.ShowtimeId = @showtimeId`;

            const result = await request.query(query);
            return result.recordset;

        } catch (error) {
            console.error('Error in getRoomsByShowtimeId:', error);
            throw error;
        }
    },
};

module.exports = ShowtimeModel;