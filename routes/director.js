const express = require('express');
const router = express.Router();
const {
    getAllDirectors,
    getDirectorById,
    getDirectorsSorted,
    getDirectorsByBirthYearRange,
    createDirector,
    updateDirector
} = require('../controllers/directorController');

// GET /api/directors - Get all directors
router.get('/', getAllDirectors);

// GET /api/directors/sorted - Get directors sorted by field (query params: sortBy, order)
router.get('/sorted', getDirectorsSorted);

// GET /api/directors/birth-year-range - Get directors by birth year range (custom endpoint)
router.get('/birth-year-range', getDirectorsByBirthYearRange);

// GET /api/directors/:id - Get director by ID (must be last to avoid conflicts)
router.get('/:id', getDirectorById);

// POST /api/directors - Create new director
router.post('/', createDirector);

// PATCH /api/directors/:id - Update director
router.patch('/:id', updateDirector);

module.exports = router;