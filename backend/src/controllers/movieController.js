// const movieModel = require('../models/movieModel'); // Import model để truy vấn cơ sở dữ liệu

// // Controller cho API lấy tất cả các phim đang chiếu
// exports.getNowShowing = async (req, res) => {
//     await movieModel.getNowShowing((err, result) => {
//         if (err) return res.status(500).json({ error: err }); // Trả về lỗi nếu         
//         res.json(result); // Trả về kết quả là mảng các phim
//     });
// };

// // Controller cho API lấy phim theo thể loại
// exports.getMoviesByGenre = (req, res) => {
//     movieModel.getMoviesByGenre(req.params.genre, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy tất cả các thể loại phim
// exports.getGenres = (req, res) => {
//     movieModel.getGenres((err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy chi tiết một phim theo tiêu đề
// exports.getMovieDetails = (req, res) => {
//     movieModel.getMovieDetails(req.params.title, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result[0]); // Trả về một đối tượng phim
//     });
// };

// // Controller cho API lấy danh sách các tỉnh có rạp
// exports.getLocations = (req, res) => {
//     movieModel.getLocations((err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy phim đang chiếu tại một tỉnh
// exports.getMoviesByLocation = (req, res) => {
//     movieModel.getMoviesByLocation(req.params.location, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các rạp tại một tỉnh
// exports.getTheatersByLocation = (req, res) => {
//     movieModel.getTheatersByLocation(req.params.location, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các rạp chiếu một phim tại một tỉnh
// exports.getTheatersShowingMovieInLocation = (req, res) => {
//     const { location, title } = req.params;
//     movieModel.getTheatersShowingMovieInLocation(location, title, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các rạp chiếu một phim trên toàn quốc
// exports.getTheatersShowingMovieNationwide = (req, res) => {
//     movieModel.getTheatersShowingMovieNationwide(req.params.title, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các suất chiếu cho một phim tại một rạp trong khoảng thời gian
// exports.getShowtimesByMovieTheaterAndTimeRange = (req, res) => {
//     const { title, theater, startTime, endTime } = req.params;
//     movieModel.getShowtimesByMovieTheaterAndTimeRange(title, theater, startTime, endTime, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các suất chiếu cho một phim tại các rạp của một tỉnh trong khoảng thời gian
// exports.getShowtimesByMovieLocationAndTimeRange = (req, res) => {
//     const { title, location, startTime, endTime } = req.params;
//     movieModel.getShowtimesByMovieLocationAndTimeRange(title, location, startTime, endTime, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

// // Controller cho API lấy các suất chiếu cho một phim tại các rạp trên cả nước trong khoảng thời gian
// exports.getShowtimesByMovieNationwideAndTimeRange = (req, res) => {
//     const { title, startTime, endTime } = req.params;
//     movieModel.getShowtimesByMovieNationwideAndTimeRange(title, startTime, endTime, (err, result) => {
//         if (err) return res.status(500).json({ error: err });
//         res.json(result);
//     });
// };

const MovieModel = require('../models/movieModel');

// Lấy danh sách tất cả các phim
const getAllMovies = async (req, res) => {
    try {
        const movies = await MovieModel.getAll();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy danh sách phim', details: err });
    }
};

// Lấy thông tin chi tiết một phim
const getMovieById = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await MovieModel.getById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy thông tin phim', details: err });
    }
};

// Thêm một phim mới
const createMovie = async (req, res) => {
    const { Title, Description, Genre, ReleaseDate, Rating, Duration, Director, PosterUrl } = req.body;
    try {
        const result = await MovieModel.create({ Title, Genre, Duration, ReleaseDate, Rating, Description, Director, PosterUrl });
        res.status(201).json({ message: 'Phim đã được tạo thành công', movie: result });
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo phim', details: err });
    }
};

// Cập nhật thông tin phim
const updateMovie = async (req, res) => {
    const { id } = req.params;
    const { Title, Genre, Duration, ReleaseDate, Rating, Description, Director, PosterUrl } = req.body;
    try {
        const result = await MovieModel.update(id, { Title, Genre, Duration, ReleaseDate, Rating, Description, Director, PosterUrl });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }
        res.status(200).json({ message: 'Cập nhật phim thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật phim', details: err });
    }
};

// Xóa một phim
const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await MovieModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }
        res.status(200).json({ message: 'Phim đã bị xóa' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể xóa phim', details: err });
    }
};

// Lấy các phim hiện đang chiếu
const getMoviesCurrentlyShowing = async (req, res) => {
    try {
        const movies = await MovieModel.getMoviesCurrentlyShowing();
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies currently showing' });
        }
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies', details: err });
    }
};

// Lấy các bộ phim theo thể loại
const getMoviesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const movies = await MovieModel.getMoviesByGenre(genre);
        if (movies.length === 0) {
            return res.status(404).json({ message: `No movies found for genre: ${genre}` });
        }
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies by genre', details: err });
    }
};

// Lấy tất cả các thể loại phim
const getAllGenres = async (req, res) => {
    try {
        const genres = await MovieModel.getAllGenres();
        if (genres.length === 0) {
            return res.status(404).json({ message: 'No genres found' });
        }
        res.status(200).json(genres);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch genres', details: err });
    }
};

// Lấy phim đang chiếu tại một thành phố
const getMoviesCurrentlyShowingByLocation = async (req, res) => {
    const { location } = req.params;
    try {
        const movies = await MovieModel.getMoviesCurrentlyShowingByLocation(location);
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found for the given location' });
        }
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies by location', details: err });
    }
};

// Lấy phim đang chiếu tại một thành phố trong 3 ngày tiếp theo
const getMoviesCurrentlyShowingByLocationInThreeDay = async (req, res) => {
    const { location } = req.params;
    try {
        const movies = await MovieModel.getMoviesCurrentlyShowingByLocationInThreeDay(location);
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found for the given location in the next 3 days' });
        }
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies by location in the next 3 days', details: err });
    }
};

// Lấy phim đang chiếu tại trong 3 ngày tiếp theo
const getMoviesCurrentlyShowingInThreeDay = async (req, res) => {
    try {
        const movies = await MovieModel.getMoviesCurrentlyShowingInThreeDay();
        if (movies.length === 0) {
            return res.status(404).json({ message: 'No movies found in the next 3 days' });
        }
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies in the next 3 days', details: err });
    }
};

// Lấy chi tiết một phim bằng tên phim
const getMovieDetailsByTitle = async (req, res) => {
    const { title } = req.params;

    try {
        const movie = await MovieModel.getMovieDetailsByTitle(title);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movie details', details: err });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesCurrentlyShowing,
    getMoviesCurrentlyShowingInThreeDay,
    getMoviesCurrentlyShowingByLocation,
    getMoviesCurrentlyShowingByLocationInThreeDay,
    getMoviesByGenre,
    getAllGenres,
    getMovieDetailsByTitle,
};

