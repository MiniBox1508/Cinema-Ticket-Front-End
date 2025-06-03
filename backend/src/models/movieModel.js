// const db = require('../config/db'); // Kết nối cơ sở dữ liệu

// // Truy vấn SQL để lấy tất cả các phim đang chiếu
// exports.getNowShowing = (callback) => {
//     db.query('SELECT * FROM Movies', callback);
// };

// // Truy vấn SQL để lấy các phim theo thể loại
// exports.getMoviesByGenre = (genre, callback) => {
//     db.query('SELECT * FROM Movies WHERE Genre = ?', [genre], callback);
// };

// // Truy vấn SQL để lấy tất cả các thể loại phim
// exports.getGenres = (callback) => {
//     db.query('SELECT DISTINCT Genre FROM Movies', callback);
// };

// // Truy vấn SQL để lấy chi tiết của một phim theo tiêu đề
// exports.getMovieDetails = (title, callback) => {
//     db.query('SELECT * FROM Movies WHERE Title = ?', [title], callback);
// };

// // Truy vấn SQL để lấy danh sách các tỉnh có rạp
// exports.getLocations = (callback) => {
//     db.query('SELECT DISTINCT Location FROM Theaters', callback);
// };

// // Truy vấn SQL để lấy các phim đang chiếu tại một tỉnh
// exports.getMoviesByLocation = (location, callback) => {
//     const sql = `
//         SELECT DISTINCT Movies.* FROM Movies 
//         JOIN Showtimes ON Movies.MovieId = Showtimes.MovieId 
//         JOIN Theaters ON Showtimes.TheaterId = Theaters.TheaterId 
//         WHERE Theaters.Location = ?`;
//     db.query(sql, [location], callback);
// };

// // Truy vấn SQL để lấy các rạp tại một tỉnh
// exports.getTheatersByLocation = (location, callback) => {
//     db.query('SELECT * FROM Theaters WHERE Location = ?', [location], callback);
// };

// // Truy vấn SQL để lấy các rạp chiếu một phim tại một tỉnh
// exports.getTheatersShowingMovieInLocation = (location, title, callback) => {
//     const sql = `
//         SELECT Theaters.* FROM Theaters 
//         JOIN Showtimes ON Theaters.TheaterId = Showtimes.TheaterId 
//         JOIN Movies ON Showtimes.MovieId = Movies.MovieId 
//         WHERE Theaters.Location = ? AND Movies.Title = ?`;
//     db.query(sql, [location, title], callback);
// };

// // Truy vấn SQL để lấy các rạp chiếu một phim trên toàn quốc
// exports.getTheatersShowingMovieNationwide = (title, callback) => {
//     const sql = `
//         SELECT DISTINCT Theaters.* FROM Theaters 
//         JOIN Showtimes ON Theaters.TheaterId = Showtimes.TheaterId 
//         JOIN Movies ON Showtimes.MovieId = Movies.MovieId 
//         WHERE Movies.Title = ?`;
//     db.query(sql, [title], callback);
// };

// // Truy vấn SQL để lấy các suất chiếu cho một phim tại một rạp trong khoảng thời gian
// exports.getShowtimesByMovieTheaterAndTimeRange = (title, theater, startTime, endTime, callback) => {
//     const sql = `
//         SELECT Showtimes.* FROM Showtimes 
//         JOIN Movies ON Showtimes.MovieId = Movies.MovieId 
//         JOIN Theaters ON Showtimes.TheaterId = Theaters.TheaterId 
//         WHERE Movies.Title = ? AND Theaters.Name = ? 
//         AND Showtimes.StartTime >= ? AND Showtimes.EndTime <= ?`;
//     db.query(sql, [title, theater, startTime, endTime], callback);
// };

// // Truy vấn SQL để lấy các suất chiếu cho một phim tại các rạp của một tỉnh trong khoảng thời gian
// exports.getShowtimesByMovieLocationAndTimeRange = (title, location, startTime, endTime, callback) => {
//     const sql = `
//         SELECT Showtimes.* FROM Showtimes 
//         JOIN Movies ON Showtimes.MovieId = Movies.MovieId 
//         JOIN Theaters ON Showtimes.TheaterId = Theaters.TheaterId 
//         WHERE Movies.Title = ? AND Theaters.Location = ? 
//         AND Showtimes.StartTime >= ? AND Showtimes.EndTime <= ?`;
//     db.query(sql, [title, location, startTime, endTime], callback);
// };

// // Truy vấn SQL để lấy các suất chiếu cho một phim tại các rạp trên cả nước trong khoảng thời gian
// exports.getShowtimesByMovieNationwideAndTimeRange = (title, startTime, endTime, callback) => {
//     const sql = `
//         SELECT Showtimes.* FROM Showtimes 
//         JOIN Movies ON Showtimes.MovieId = Movies.MovieId 
//         WHERE Movies.Title = ? AND Showtimes.StartTime >= ? 
//         AND Showtimes.EndTime <= ?`;
//     db.query(sql, [title, startTime, endTime], callback);
// };


const db = require('../config/db');

const MovieModel = {
    getAll: () => {
        const query = 'SELECT * FROM Movies';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getById: (id) => {
        const query = 'SELECT * FROM Movies WHERE MovieId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },

    create: (movie) => {
        const query = 'INSERT INTO Movies (Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const { Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl } = movie;
        return new Promise((resolve, reject) => {
            db.query(query, [Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    update: (id, movie) => {
        const query = 'UPDATE Movies SET Title = ?, Description = ?, Genre = ?, ReleaseDate = ?, Rating = ?, Duration = ?, Director = ?, PosterUrl = ? WHERE MovieId = ?';
        const { Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl } = movie;
        return new Promise((resolve, reject) => {
            db.query(query, [Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    delete: (id) => {
        const query = 'DELETE FROM Movies WHERE MovieId = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getMoviesCurrentlyShowing: () => {
        const query = `
            SELECT DISTINCT m.MovieId, m.Title, m.Description, m.Genre, m.ReleaseDate, m.Rating, m.Duration, m.Director, m.PosterUrl
            FROM Movies m
            JOIN Showtimes s ON m.MovieId = s.MovieId
            WHERE s.StartTime > NOW();
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getMoviesByGenre: (genre) => {
        const query = 'SELECT * FROM Movies WHERE Genre LIKE ?';
        return new Promise((resolve, reject) => {
            db.query(query, [`%${genre}%`], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getAllGenres: () => {
        const query = 'SELECT DISTINCT Genre FROM Movies';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getMoviesCurrentlyShowingByLocation: (location) => {
        const query = `
            SELECT DISTINCT m.MovieId, m.Title, m.Description, m.Genre, m.ReleaseDate, m.Rating, m.Duration, m.Director, m.PosterUrl
            FROM Movies m
            JOIN Showtimes s ON m.MovieId = s.MovieId
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            WHERE t.Location = ? AND s.StartTime > NOW();
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [location], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

    },

    getMoviesCurrentlyShowingByLocationInThreeDay: (location) => {
        const query = `
            SELECT DISTINCT m.MovieId, m.Title, m.Description, m.Genre, m.ReleaseDate, m.Rating, m.Duration, m.Director, m.PosterUrl
            FROM Movies m
            JOIN Showtimes s ON m.MovieId = s.MovieId
            JOIN Theaters t ON s.TheaterId = t.TheaterId
            WHERE t.Location = ? 
            AND s.StartTime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY);
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [location], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getMoviesCurrentlyShowingInThreeDay: () => {
        const query = `
            SELECT DISTINCT m.MovieId, m.Title, m.Description, m.Genre, m.ReleaseDate, m.Rating, m.Duration, m.Director, m.PosterUrl
            FROM Movies m
            JOIN Showtimes s ON m.MovieId = s.MovieId
            WHERE s.StartTime BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY);
        `;
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    getMovieDetailsByTitle: (title) => {
        const query = `
            SELECT 
                MovieId, Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl
            FROM Movies
            WHERE Title = ?;
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [title], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Chỉ cần một kết quả
            });
        });
    },
}
module.exports = MovieModel;
