const express = require('express');
const router = express.Router();
const {
    getAllStreamingPlatforms,
    getStreamingPlatformById,
    getStreamingPlatformsSorted,
    getStreamingPlatformsWithAnalytics
} = require('../controllers/streamingPlatformController');

// GET /api/streaming-platforms - Get all streaming platforms
router.get('/', getAllStreamingPlatforms);

// GET /api/streaming-platforms/sorted - Get streaming platforms sorted by field (query params: sortBy, order)
router.get('/sorted', getStreamingPlatformsSorted);

// GET /api/streaming-platforms/with-analytics - Get streaming platforms with analytics (custom endpoint)
router.get('/with-analytics', getStreamingPlatformsWithAnalytics);

// GET /api/streaming-platforms/:id - Get streaming platform by ID (must be last to avoid conflicts)
router.get('/:id', getStreamingPlatformById);

module.exports = router;