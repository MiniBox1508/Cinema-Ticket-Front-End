const sql = require('mssql');
const config = require('../config/db');

const db = require('../config/db');

const RoomModel = {
    getAll: () => {
        const query = 'SELECT * FROM Room';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getById: (id) => {
        const query = 'SELECT * FROM Room WHERE RoomId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    create: (room) => {
        const query = 'INSERT INTO Rooms (Name, Capacity, TheaterId) VALUES (?, ?, ?)';
        const { Name, Capacity, TheaterId } = room;
        return new Promise((resolve, reject) => {
            db.query(query, [Name, Capacity, TheaterId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    update: (id, room) => {
        const query = 'UPDATE Rooms SET Name = ?, Capacity = ?, TheaterId = ? WHERE RoomId = ?';
        const { Name, Capacity, TheaterId } = room;
        return new Promise((resolve, reject) => {
            db.query(query, [Name, Capacity, TheaterId, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    delete: (id) => {
        const query = 'DELETE FROM Room WHERE RoomId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getRoomsByShowtime: async (showtimeId) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            
            request.input('showtimeId', sql.Int, showtimeId);

            const query = `
                SELECT DISTINCT
                    r.RoomId,
                    r.Name,
                    r.TotalSeat,
                    t.Name as TheaterName,
                    s.StartTime,
                    s.EndTime,
                    s.Price
                FROM Room r
                INNER JOIN Theaters t ON r.TheaterId = t.TheaterId
                INNER JOIN Showtimes s ON r.RoomId = s.RoomId
                WHERE s.ShowtimeId = @showtimeId`;

            const result = await request.query(query);
            console.log('Found rooms:', result.recordset.length);
            return result.recordset;

        } catch (error) {
            console.error('Error in getRoomsByShowtime:', error);
            throw error;
        }
    }
};

module.exports = RoomModel;
