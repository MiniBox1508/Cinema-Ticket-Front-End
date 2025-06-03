const db = require('../config/db');

const PaymentModel = {
    getAll: () => {
        const query = 'SELECT * FROM Payments';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getById: (id) => {
        const query = 'SELECT * FROM Payments WHERE PaymentId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    create: (payment) => {
        const query = `
            INSERT INTO Payments (PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId)
            VALUES (?, ?, ?, ?, ?)
        `;
        const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = payment;

        return new Promise((resolve, reject) => {
            db.query(query, [PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    update: (id, payment) => {
        const query = `
            UPDATE Payments
            SET PaymentStatus = ?, Amount = ?, PaymentTime = ?, PaymentMethod = ?, UserId = ?
            WHERE PaymentId = ?
        `;
        const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = payment;

        return new Promise((resolve, reject) => {
            db.query(query, [PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    delete: (id) => {
        const query = 'DELETE FROM Payments WHERE PaymentId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
};

module.exports = PaymentModel;
