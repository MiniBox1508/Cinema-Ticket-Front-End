const express = require('express');
const {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime,
    getAllShowtimesWithDetails,
    getShowtimesForMovieInThreeDays,
    getShowtimesByTheaterAndMovie,
} = require('../controllers/showtimeController');

const router = express.Router();

// Base routes
router.get('/', getAllShowtimes);
router.get('/details', getAllShowtimesWithDetails);
router.get('/theater/:theaterId/movie/:movieId', getShowtimesByTheaterAndMovie); // Add this line
router.get('/movie/:movieId/next-three-days', getShowtimesForMovieInThreeDays);

// Basic CRUD routes
router.get('/:id', getShowtimeById);
router.post('/', createShowtime);
router.put('/:id', updateShowtime);
router.delete('/:id', deleteShowtime);

module.exports = router;
