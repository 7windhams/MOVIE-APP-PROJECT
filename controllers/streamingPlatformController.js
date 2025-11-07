const { pool } = require('../config/database');

// Get all streaming platforms
const getAllStreamingPlatforms = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM streaming_platform ORDER BY streaming_platform_name ASC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all streaming platforms:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch streaming platforms',
            message: error.message
        });
    }
};

// Get streaming platform by ID
const getStreamingPlatformById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM streaming_platform WHERE streaming_platform_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Streaming platform not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching streaming platform by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch streaming platform',
            message: error.message
        });
    }
};

// Get streaming platforms sorted by specific field
const getStreamingPlatformsSorted = async (req, res) => {
    try {
        const { sortBy = 'streaming_platform_name', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['streaming_platform_id', 'streaming_platform_name', 'streaming_platform_launch_year', 'streaming_platform_subscription_cost'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'streaming_platform_name';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(
            `SELECT * FROM streaming_platform ORDER BY ${validSortField} ${validOrder}`
        );
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted streaming platforms:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted streaming platforms',
            message: error.message
        });
    }
};

// Custom endpoint: Get streaming platforms with movie count and subscription cost analysis
const getStreamingPlatformsWithAnalytics = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                sp.*,
                COUNT(msp.movie_id) as movie_count,
                ROUND(AVG(m.movie_rating), 2) as avg_movie_rating,
                COUNT(CASE WHEN m.movie_release_year >= 2020 THEN 1 END) as recent_movies_count
            FROM streaming_platform sp
            LEFT JOIN movie_streaming_platform msp ON sp.streaming_platform_id = msp.streaming_platform_id
            LEFT JOIN movie m ON msp.movie_id = m.movie_id
            GROUP BY sp.streaming_platform_id, sp.streaming_platform_name, 
                     sp.streaming_platform_launch_year, sp.streaming_platform_subscription_cost
            ORDER BY movie_count DESC, sp.streaming_platform_name ASC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching streaming platforms with analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch streaming platforms with analytics',
            message: error.message
        });
    }
};

module.exports = {
    getAllStreamingPlatforms,
    getStreamingPlatformById,
    getStreamingPlatformsSorted,
    getStreamingPlatformsWithAnalytics
};