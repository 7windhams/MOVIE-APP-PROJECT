const express = require('express');
const router = express.Router();
const {
    getAllMovies,
    getMovieById,
    getMoviesSorted,
    getMoviesByGenre,
    createMovie,
    updateMovie
} = require('../controllers/movieController');

// GET /api/movies - Get all movies
router.get('/', getAllMovies);

// GET /api/movies/sorted - Get movies sorted by field (query params: sortBy, order)
router.get('/sorted', getMoviesSorted);

// GET /api/movies/genre/:genre - Get movies by genre with actor count (custom endpoint)
router.get('/genre/:genre', getMoviesByGenre);

// GET /api/movies/:id - Get movie by ID with all related data (must be last to avoid conflicts)
router.get('/:id', getMovieById);

// POST /api/movies - Create new movie
router.post('/', createMovie);

// PATCH /api/movies/:id - Update movie
router.patch('/:id', updateMovie);

module.exports = router;