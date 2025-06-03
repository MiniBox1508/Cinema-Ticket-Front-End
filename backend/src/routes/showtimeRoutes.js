const express = require('express');
const {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime,
    getShowtimesForMovieByLocationAndTimeRange,
    getShowtimesForMovieByTimeRange,
    getShowtimesForMovieInThreeDaysInLocation,
    getShowtimesForMovieInThreeDays,
} = require('../controllers/showtimeController');

const router = express.Router();
router.get('/:movieId/next-three-days', getShowtimesForMovieInThreeDays);
router.get('/:movieId/:location/next-three-days', getShowtimesForMovieInThreeDaysInLocation);
router.get('/:movieId/:location/:startTime/:endTime', getShowtimesForMovieByLocationAndTimeRange);
router.get('/:movieId/:startTime/:endTime', getShowtimesForMovieByTimeRange);
router.get('/', getAllShowtimes);
router.get('/:id', getShowtimeById);
router.post('/', createShowtime);
router.put('/:id', updateShowtime);
router.delete('/:id', deleteShowtime);


module.exports = router;
