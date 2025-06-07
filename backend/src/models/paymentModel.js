const { sql } = require('../config/db');

const PaymentModel = {
    getAll: async () => {
        const result = await sql.query`SELECT * FROM Payments`;
        return result.recordset;
    },

    getById: async (id) => {
        const result = await sql.query`
            SELECT * FROM Payments WHERE PaymentId = ${id}`;
        return result.recordset[0];
    },

    create: async (payment) => {
        const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = payment;
        const result = await sql.query`
            INSERT INTO Payments (
                PaymentStatus, Amount, PaymentTime, 
                PaymentMethod, UserId
            ) VALUES (
                ${PaymentStatus}, ${Amount}, ${PaymentTime}, 
                ${PaymentMethod}, ${UserId}
            );
            SELECT SCOPE_IDENTITY() AS PaymentId;
        `;
        return result.recordset[0];
    },

    update: async (id, payment) => {
        const { PaymentStatus, Amount, PaymentTime, PaymentMethod, UserId } = payment;
        const result = await sql.query`
            UPDATE Payments 
            SET PaymentStatus = ${PaymentStatus},
                Amount = ${Amount},
                PaymentTime = ${PaymentTime},
                PaymentMethod = ${PaymentMethod},
                UserId = ${UserId}
            WHERE PaymentId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    delete: async (id) => {
        const result = await sql.query`
            DELETE FROM Payments WHERE PaymentId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    }
};

module.exports = PaymentModel;
