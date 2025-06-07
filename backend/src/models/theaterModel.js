const { sql } = require('../config/db');

const TheaterModel = {
    getAll: async () => {
        const result = await sql.query`SELECT * FROM Theaters`;
        return result.recordset;
    },

    getById: async (id) => {
        const result = await sql.query`
            SELECT * FROM Theaters WHERE TheaterId = ${id}`;
        return result.recordset[0];
    },

    create: async (theater) => {
        const { Name, TotalRoom, Location } = theater;
        const result = await sql.query`
            INSERT INTO Theaters (Name, TotalRoom, Location) 
            VALUES (${Name}, ${TotalRoom}, ${Location});
            SELECT SCOPE_IDENTITY() AS TheaterId;
        `;
        return result.recordset[0];
    },

    update: async (id, theater) => {
        const { Name, TotalRoom, Location } = theater;
        const result = await sql.query`
            UPDATE Theaters 
            SET Name = ${Name},
                TotalRoom = ${TotalRoom},
                Location = ${Location}
            WHERE TheaterId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    delete: async (id) => {
        const result = await sql.query`
            DELETE FROM Theaters WHERE TheaterId = ${id}
        `;
        return result.rowsAffected[0] > 0;
    },

    getLocations: async () => {
        const result = await sql.query`
            SELECT DISTINCT Location FROM Theaters`;
        return result.recordset;
    },

    getTheatersShowingMovie: async (MovieId) => {
        const result = await sql.query`
            SELECT DISTINCT t.TheaterId, t.Name, t.Location
            FROM Theaters t
            JOIN Showtime s ON t.TheaterId = s.TheaterId
            WHERE s.MovieId = ${MovieId}
        `;
        return result.recordset;
    },

    getMoviesByTheater: async (theaterId) => {
        try {
            const query = `
                SELECT DISTINCT 
                    m.MovieId,
                    m.Title,
                    m.Description,
                    m.Genre,
                    m.Duration,
                    m.ReleaseDate,
                    m.Rating,
                    m.PosterUrl,
                    m.Director
                FROM Movies m
                JOIN Showtimes s ON m.MovieId = s.MovieId
                WHERE s.TheaterId = @theaterId
                ORDER BY m.Title`;

            const request = new sql.Request();
            request.input('theaterId', sql.Int, theaterId);
            
            console.log('Executing query:', query); // Debug log
            console.log('TheaterId:', theaterId); // Debug log
            
            const result = await request.query(query);
            console.log('Query result:', result.recordset); // Debug log
            
            return result.recordset;
        } catch (error) {
            console.error('Database error in getMoviesByTheater:', error);
            throw error;
        }
    }
};

module.exports = TheaterModel;
