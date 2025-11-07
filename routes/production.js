const express = require('express');
const router = express.Router();
const {
    getAllProductions,
    getProductionById,
    getProductionsSorted,
    getProductionsWithMovieStats
} = require('../controllers/productionController');

// GET /api/productions - Get all productions
router.get('/', getAllProductions);

// GET /api/productions/sorted - Get productions sorted by field (query params: sortBy, order)
router.get('/sorted', getProductionsSorted);

// GET /api/productions/with-movie-stats - Get productions with movie statistics (custom endpoint)
router.get('/with-movie-stats', getProductionsWithMovieStats);

// GET /api/productions/:id - Get production by ID (must be last to avoid conflicts)
router.get('/:id', getProductionById);

module.exports = router;