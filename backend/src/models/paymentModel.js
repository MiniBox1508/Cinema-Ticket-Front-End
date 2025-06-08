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

    create: async (payment, request = null) => {
        try {
            // Use provided request or create new one
            const req = request || (await sql.connect()).request();
            
            req.input('status', sql.NVarChar, payment.PaymentStatus);
            req.input('amount', sql.Decimal, payment.Amount);
            req.input('time', sql.DateTime, payment.PaymentTime);
            req.input('method', sql.NVarChar, payment.PaymentMethod);
            req.input('userId', sql.Int, payment.UserId);

            const result = await req.query(`
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
