const { sql } = require('../config/db');

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

    create: async (payment) => {
        try {
            const pool = await sql.connect();
            const request = pool.request();
            
            request.input('status', sql.NVarChar, payment.PaymentStatus);
            request.input('amount', sql.Decimal, payment.Amount);
            request.input('time', sql.DateTime, payment.PaymentTime);
            request.input('method', sql.NVarChar, payment.PaymentMethod);
            request.input('userId', sql.Int, payment.UserId);

            const result = await request.query(`
                INSERT INTO Payments (
                    PaymentStatus, 
                    Amount, 
                    PaymentTime, 
                    PaymentMethod, 
                    UserId
                ) 
                OUTPUT INSERTED.PaymentId
                VALUES (
                    @status,
                    @amount,
                    @time,
                    @method,
                    @userId
                )
            `);

            return result.recordset[0];

        } catch (error) {
            console.error('Error in create payment:', error);
            throw error;
        }
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
