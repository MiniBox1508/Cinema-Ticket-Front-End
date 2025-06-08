const db = require('../config/db');
const sql = require('mssql');
const config = require('../config/db');

const SeatModel = {
    getAll: () => {
        const query = 'SELECT * FROM Seats';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getById: (id) => {
        const query = 'SELECT * FROM Seats WHERE SeatId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    create: (seat) => {
        const query = 'INSERT INTO Seats (SeatNumber, Line, RoomId) VALUES (?, ?, ?)';
        const { SeatNumber, Line, RoomId } = seat;
        return new Promise((resolve, reject) => {
            db.query(query, [SeatNumber, Line, RoomId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    update: (id, seat) => {
        const query = 'UPDATE Seats SET SeatNumber = ?, Line = ?, RoomId = ? WHERE SeatId = ?';
        const { SeatNumber, Line, RoomId } = seat;
        return new Promise((resolve, reject) => {
            db.query(query, [SeatNumber, Line, RoomId, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    delete: (id) => {
        const query = 'DELETE FROM Seats WHERE SeatId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getSeatsByRoomId: async (RoomId) => {
        try {
            const pool = await sql.connect(config);
            const request = pool.request();
            request.input('RoomId', sql.Int, RoomId);

            const query = `
                SELECT 
                    SeatId,
                    SeatNumber,
                    Line,
                    RoomId
                FROM Seats
                WHERE RoomId = @RoomId
                ORDER BY Line, SeatNumber`;

            const result = await request.query(query);
            console.log('Found seats for room', RoomId, ':', result.recordset.length);
            return result.recordset;

        } catch (error) {
            console.error('Error in getSeatsByRoomId:', error);
            throw error;
        }
    }
};

module.exports = SeatModel;
