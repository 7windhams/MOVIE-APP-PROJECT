const express = require('express');
const router = express.Router();
const {
    getAllGenres,
    getGenreById,
    getGenresSorted,
    getGenresWithMovieCount,
    createGenre,
    updateGenre
} = require('../controllers/genreController');

// GET /api/genres - Get all genres
router.get('/', getAllGenres);

// GET /api/genres/sorted - Get genres sorted by field (query params: sortBy, order)
router.get('/sorted', getGenresSorted);

// GET /api/genres/with-movie-count - Get genres with movie count (custom endpoint)
router.get('/with-movie-count', getGenresWithMovieCount);

// GET /api/genres/:id - Get genre by ID (must be last to avoid conflicts)
router.get('/:id', getGenreById);

// POST /api/genres - Create new genre
router.post('/', createGenre);

// PATCH /api/genres/:id - Update genre
router.patch('/:id', updateGenre);

module.exports = router;