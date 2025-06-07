const express = require('express');
const {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime,
    getAllShowtimesWithDetails,
    getShowtimesForMovieInThreeDays,
} = require('../controllers/showtimeController');

const router = express.Router();

// Base routes
router.get('/', getAllShowtimes);
router.get('/details', getAllShowtimesWithDetails);

// Other routes
router.get('/:id', getShowtimeById);
router.post('/', createShowtime);
router.put('/:id', updateShowtime);
router.delete('/:id', deleteShowtime);
router.get('/movie/:movieId/next-three-days', getShowtimesForMovieInThreeDays);

module.exports = router;
