const ShowtimeModel = require('../models/showtimeModel');

// Lấy danh sách tất cả các suất chiếu
const getAllShowtimes = async (req, res) => {
    try {
        console.log('Getting all showtimes...'); // Debug log

        const showtimes = await ShowtimeModel.getAll();
        
        console.log('Showtimes found:', showtimes?.length || 0); // Debug log

        if (!showtimes || showtimes.length === 0) {
            console.log('No showtimes available'); // Debug log
            return res.status(404).json({ 
                message: 'Không có suất chiếu nào',
                details: 'Không tìm thấy suất chiếu nào trong cơ sở dữ liệu' 
            });
        }

        res.status(200).json({
            count: showtimes.length,
            showtimes: showtimes
        });
    } catch (err) {
        console.error('Error getting showtimes:', err); // Debug log
        res.status(500).json({ 
            error: 'Không thể lấy danh sách suất chiếu',
            details: err.message 
        });
    }
};

// Lấy thông tin chi tiết một suất chiếu
const getShowtimeById = async (req, res) => {
    const { id } = req.params;
    try {
        const showtime = await ShowtimeModel.getById(id);
        if (!showtime) {
            return res.status(404).json({ message: 'Suất chiếu không tồn tại' });
        }
        res.status(200).json(showtime);
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy thông tin suất chiếu', details: err });
    }
};

// Thêm một suất chiếu mới
const createShowtime = async (req, res) => {
    const { StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId } = req.body;
    try {
        const result = await ShowtimeModel.create({ StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId });
        res.status(201).json({ message: 'Suất chiếu đã được tạo thành công', showtime: result });
    } catch (err) {
        res.status(500).json({ error: 'Không thể tạo suất chiếu', details: err });
    }
};

// Cập nhật thông tin suất chiếu
const updateShowtime = async (req, res) => {
    const { id } = req.params;
    const { StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId } = req.body;
    try {
        const result = await ShowtimeModel.update(id, { StartTime, EndTime, SeatStatus, Price, TheaterId, RoomId, MovieId });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Suất chiếu không tồn tại' });
        }
        res.status(200).json({ message: 'Cập nhật suất chiếu thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật suất chiếu', details: err });
    }
};

// Xóa một suất chiếu
const deleteShowtime = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ShowtimeModel.delete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Suất chiếu không tồn tại' });
        }
        res.status(200).json({ message: 'Suất chiếu đã bị xóa' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể xóa suất chiếu', details: err });
    }
};

// Lấy tất cả các suất chiếu của một phim tại một tỉnh trong một khoảng thời gian
const getShowtimesForMovieByLocationAndTimeRange = async (req, res) => {
    const { movieId, location, startTime, endTime } = req.params;

    try {
        const showtimes = await ShowtimeModel.getShowtimesForMovieByLocationAndTimeRange(movieId, location, startTime, endTime);

        if (showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for the given criteria' });
        }

        res.status(200).json(showtimes);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch showtimes',
            details: err.message,
        });
    }
};

// Lấy tất cả suất chiếu của một phim trong khoảng thời gian theo movieId
const getShowtimesForMovieByTimeRange = async (req, res) => {
    const { movieId, startTime, endTime } = req.params;
    try {
        const showtimes = await ShowtimeModel.getShowtimesForMovieByTimeRange(movieId, startTime, endTime);

        if (showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for the given criteria' });
        }

        res.status(200).json(showtimes);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch showtimes',
            details: err.message,
        });
    }
};

// Lấy tất cả các suất chiếu của một phim tại một tỉnh trong 3 ngày tới
const getShowtimesForMovieInThreeDaysInLocation = async (req, res) => {
    const { movieId, location } = req.params;

    try {
        const showtimes = await ShowtimeModel.getShowtimesForMovieInThreeDaysInLocation(movieId, location);
        if (showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for this movie in the next 3 days in this location' });
        }
        res.status(200).json(showtimes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch showtimes', details: err });
    }
};

// Lấy tất cả các suất chiếu của một phim trong 3 ngày tới
const getShowtimesForMovieInThreeDays = async (req, res) => {
    const { movieId } = req.params;

    try {
        const showtimes = await ShowtimeModel.getShowtimesForMovieInThreeDays(movieId);
        if (showtimes.length === 0) {
            return res.status(404).json({ message: 'No showtimes found for this movie in the next 3 days' });
        }
        res.status(200).json(showtimes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch showtimes', details: err });
    }
};

// Lấy danh sách tất cả các suất chiếu với thông tin chi tiết
const getAllShowtimesWithDetails = async (req, res) => {
    try {
        const showtimes = await ShowtimeModel.getAllShowtimesWithDetails();
        
        if (!showtimes || showtimes.length === 0) {
            return res.status(404).json({ message: 'Không có lịch chiếu nào' });
        }

        // Nhóm lịch chiếu theo phim và rạp
        const groupedShowtimes = showtimes.reduce((acc, showtime) => {
            const key = `${showtime.MovieTitle}-${showtime.TheaterName}`;
            if (!acc[key]) {
                acc[key] = {
                    movieTitle: showtime.MovieTitle,
                    theaterName: showtime.TheaterName,
                    posterUrl: showtime.PosterUrl,
                    rating: showtime.Rating,
                    price: showtime.Price,
                    showtimes: []
                };
            }
            acc[key].showtimes.push({
                showtimeId: showtime.ShowtimeId,
                startTime: showtime.StartTime,
                endTime: showtime.EndTime,
                roomName: showtime.RoomName,
                seatStatus: showtime.SeatStatus
            });
            return acc;
        }, {});

        res.status(200).json(Object.values(groupedShowtimes));
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: 'Không thể tải danh sách lịch chiếu',
            details: err.message 
        });
    }
};

module.exports = {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime,
    getShowtimesForMovieByLocationAndTimeRange,
    getShowtimesForMovieByTimeRange,
    getShowtimesForMovieInThreeDaysInLocation,
    getShowtimesForMovieInThreeDays,
    getAllShowtimesWithDetails
};
