const { pool } = require('../config/database');

// Get all productions
const getAllProductions = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM production ORDER BY production_name ASC'
        );
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all productions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch productions',
            message: error.message
        });
    }
};

// Get production by ID
const getProductionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM production WHERE production_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Production not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching production by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch production',
            message: error.message
        });
    }
};

// Get productions sorted by specific field
const getProductionsSorted = async (req, res) => {
    try {
        const { sortBy = 'production_name', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['production_id', 'production_name', 'production_founded_year', 'production_headquarters'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'production_name';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(
            `SELECT * FROM production ORDER BY ${validSortField} ${validOrder}`
        );
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted productions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted productions',
            message: error.message
        });
    }
};

// Custom endpoint: Get productions with movie count and latest movie year
const getProductionsWithMovieStats = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                p.*,
                COUNT(m.movie_id) as movie_count,
                MAX(m.movie_release_year) as latest_movie_year,
                MIN(m.movie_release_year) as earliest_movie_year
            FROM production p
            LEFT JOIN movie m ON p.production_id = m.production_id
            GROUP BY p.production_id, p.production_name, p.production_founded_year, p.production_headquarters
            ORDER BY movie_count DESC, p.production_name ASC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching productions with movie stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch productions with movie statistics',
            message: error.message
        });
    }
};

module.exports = {
    getAllProductions,
    getProductionById,
    getProductionsSorted,
    getProductionsWithMovieStats
};