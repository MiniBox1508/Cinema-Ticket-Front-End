const express = require('express');
const router = express.Router();
const {
    getAllTheaters,
    getTheaterById,
    createTheater,
    updateTheater,
    deleteTheater,
    getLocations,
    getTheatersShowingMovie,
    getMoviesByTheater
} = require('../controllers/theaterController');

// Đảm bảo route này được đặt trước '/:id'
router.get('/:theaterId/movies', getMoviesByTheater);

router.get('/locations', getLocations);
router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);
router.post('/', createTheater);
router.put('/:id', updateTheater);
router.delete('/:id', deleteTheater);

module.exports = router;
