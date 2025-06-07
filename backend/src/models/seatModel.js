const { sql } = require('../config/db');

const SeatModel = {
    getAll: async () => {
        const result = await sql.query`SELECT * FROM Seats`;
        return result.recordset;
    },

    getById: async (id) => {
        const result = await sql.query`
            SELECT * FROM Seats WHERE SeatId = ${id}`;
        return result.recordset[0];
    },

    create: async (seat) => {
        const { SeatNumber, Line, RoomId } = seat;
        const result = await sql.query`
            INSERT INTO Seats (SeatNumber, Line, RoomId) 
            VALUES (${SeatNumber}, ${Line}, ${RoomId});
            SELECT SCOPE_IDENTITY() AS SeatId;
        `;
        return result.recordset[0];
    },

    update: async (id, seat) => {
        const { SeatNumber, Line, RoomId } = seat;
        const result = await sql.query`
            UPDATE Seats 
            SET SeatNumber = ${SeatNumber},
                Line = ${Line},
                RoomId = ${RoomId}
            WHERE SeatId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    delete: async (id) => {
        const result = await sql.query`
            DELETE FROM Seats WHERE SeatId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    getSeatsByRoomId: async (RoomId) => {
        const result = await sql.query`
            SELECT s.*, 
                   CASE WHEN t.TicketId IS NOT NULL THEN 1 ELSE 0 END as isBooked
            FROM Seats s
            LEFT JOIN Tickets t ON s.SeatId = t.SeatId
            WHERE s.RoomId = ${RoomId}
            ORDER BY s.Line, s.SeatNumber
        `;
        return result.recordset;
    }
};

module.exports = SeatModel;
