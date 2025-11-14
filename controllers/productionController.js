const { pool } = require('../config/database');

const getAllProductions = async (req, res) => {
    try {
        const [productions] = await pool.execute('SELECT * FROM production ORDER BY production_name ASC');
        res.json(productions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching productions', error: error.message });
    }
};

const getProductionById = async (req, res) => {
    try {
        const { id } = req.params;
        const [productions] = await pool.execute('SELECT * FROM production WHERE production_id = ?', [id]);
        
        if (productions.length === 0) {
            return res.status(404).json({ message: 'Production not found' });
        }
        
        res.json(productions[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching production', error: error.message });
    }
};

const getProductionsSorted = async (req, res) => {
    try {
        const { sortBy = 'production_name', order = 'ASC' } = req.query;
        const validSortFields = ['production_name', 'production_founded_year', 'production_headquarters'];
        const validOrders = ['ASC', 'DESC'];
        
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'production_name';
        const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [productions] = await pool.execute(`SELECT * FROM production ORDER BY ${sortField} ${sortOrder}`);
        res.json({
            success: true,
            count: productions.length,
            sortedBy: sortField,
            order: sortOrder,
            data: productions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sorted productions', error: error.message });
    }
};

const getProductionsWithMovieStats = async (req, res) => {
    try {
        const [productions] = await pool.execute(`
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
            count: productions.length,
            data: productions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching productions with movie stats', error: error.message });
    }
};

const createProduction = async (req, res) => {
    try {
        const { production_name, production_founded_year, production_headquarters } = req.body;
        
        if (!production_name) {
            return res.status(400).json({ message: 'Production name is required' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO production (production_name, production_founded_year, production_headquarters) VALUES (?, ?, ?)',
            [production_name, production_founded_year || null, production_headquarters || null]
        );
        
        const [newProduction] = await pool.execute('SELECT * FROM production WHERE production_id = ?', [result.insertId]);
        
        res.status(201).json({
            message: 'Production created successfully',
            production: newProduction[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating production', error: error.message });
    }
};

const updateProduction = async (req, res) => {
    try {
        const { id } = req.params;
        const { production_name, production_founded_year, production_headquarters } = req.body;
        
        const [existingProduction] = await pool.execute('SELECT * FROM production WHERE production_id = ?', [id]);
        if (existingProduction.length === 0) {
            return res.status(404).json({ message: 'Production not found' });
        }
        
        if (!production_name) {
            return res.status(400).json({ message: 'Production name is required' });
        }
        
        await pool.execute(
            'UPDATE production SET production_name = ?, production_founded_year = ?, production_headquarters = ? WHERE production_id = ?',
            [production_name, production_founded_year || null, production_headquarters || null, id]
        );
        
        const [updatedProduction] = await pool.execute('SELECT * FROM production WHERE production_id = ?', [id]);
        
        res.json({
            message: 'Production updated successfully',
            production: updatedProduction[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating production', error: error.message });
    }
};

module.exports = {
    getAllProductions,
    getProductionById,
    getProductionsSorted,
    getProductionsWithMovieStats,
    createProduction,
    updateProduction
};