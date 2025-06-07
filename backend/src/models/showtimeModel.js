const db = require('../config/db');

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
};

module.exports = ShowtimeModel;