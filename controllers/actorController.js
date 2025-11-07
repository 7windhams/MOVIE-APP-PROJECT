const { pool } = require('../config/database');

const getAllActors = async (req, res) => {
    try {
        const [actors] = await pool.execute('SELECT * FROM actor ORDER BY actor_name');
        res.json(actors);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const getActorById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [id]);
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Actor not found' });
        }
        
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
};

// Get actors sorted by specific field
const getActorsSorted = async (req, res) => {
    try {
        const { sortBy = 'actor_name', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['actor_id', 'actor_name', 'actor_birth_year', 'actor_nationality'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'actor_name';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(
            `SELECT * FROM actor ORDER BY ${validSortField} ${validOrder}`
        );
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted actors:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted actors',
            message: error.message
        });
    }
};

// Custom endpoint: Get actors by nationality
const getActorsByNationality = async (req, res) => {
    try {
        const { nationality } = req.params;
        
        const [rows] = await pool.execute(
            'SELECT * FROM actor WHERE LOWER(actor_nationality) LIKE LOWER(?) ORDER BY actor_name ASC',
            [`%${nationality}%`]
        );
        
        res.json({
            success: true,
            nationality: nationality,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching actors by nationality:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch actors by nationality',
            message: error.message
        });
    }
};

module.exports = {
    getAllActors,
    getActorById,
    getActorsSorted,
    getActorsByNationality
};