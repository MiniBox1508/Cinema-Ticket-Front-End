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
};

module.exports = RoomModel;
