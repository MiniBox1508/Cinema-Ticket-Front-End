const express = require('express');
const router = express.Router();
// const movieController = require('../controllers/movieController');
const {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesCurrentlyShowing,
    getMoviesCurrentlyShowingByLocation,
    getMoviesCurrentlyShowingInThreeDay,
    getMoviesCurrentlyShowingByLocationInThreeDay,
    getAllGenres,
    getMoviesByGenre,
    getMovieDetailsByTitle,
} = require('../controllers/movieController');

router.get('/currently-showing-in-three-day', getMoviesCurrentlyShowingInThreeDay);
router.get('/currently-showing-in-three-day/location/:location', getMoviesCurrentlyShowingByLocationInThreeDay);
router.get('/currently-showing', getMoviesCurrentlyShowing);
router.get('/currently-showing/location/:location', getMoviesCurrentlyShowingByLocation);
router.get('/genres', getAllGenres);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/details/:title', getMovieDetailsByTitle);
router.get('/', getAllMovies);
router.get('/:id', getMovieById);
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
