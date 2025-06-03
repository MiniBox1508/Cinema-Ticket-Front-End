const express = require('express');
const {
    getAllTheaters,
    getTheaterById,
    createTheater,
    updateTheater,
    deleteTheater,
    getLocations,
    getTheatersShowingMovie,
} = require('../controllers/theaterController');

const router = express.Router();

router.get('/movies/:MovieId', getTheatersShowingMovie);
router.get('/locations', getLocations);
router.get('/', getAllTheaters);
router.get('/:id', getTheaterById);
router.post('/', createTheater);
router.put('/:id', updateTheater);
router.delete('/:id', deleteTheater);

module.exports = router;
