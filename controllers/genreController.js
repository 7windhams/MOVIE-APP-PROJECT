const { pool } = require('../config/database');

// Get all genres
const getAllGenres = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM genre ORDER BY genre_name ASC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all genres:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch genres',
            message: error.message
        });
    }
};

// Get genre by ID
const getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM genre WHERE genre_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Genre not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching genre by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch genre',
            message: error.message
        });
    }
};

// Get genres sorted by specific field
const getGenresSorted = async (req, res) => {
    try {
        const { sortBy = 'genre_name', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['genre_id', 'genre_name', 'genre_description'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'genre_name';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(
            `SELECT * FROM genre ORDER BY ${validSortField} ${validOrder}`
        );
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted genres:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted genres',
            message: error.message
        });
    }
};

// Custom endpoint: Get genres with movie count
const getGenresWithMovieCount = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                g.*,
                COUNT(mg.movie_id) as movie_count
            FROM genre g
            LEFT JOIN movie_genre mg ON g.genre_id = mg.genre_id
            GROUP BY g.genre_id, g.genre_name, g.genre_description
            ORDER BY movie_count DESC, g.genre_name ASC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching genres with movie count:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch genres with movie count',
            message: error.message
        });
    }
};

module.exports = {
    getAllGenres,
    getGenreById,
    getGenresSorted,
    getGenresWithMovieCount
};