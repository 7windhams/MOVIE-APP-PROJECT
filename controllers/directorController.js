const { pool } = require('../config/database');

const getAllDirectors = async (req, res) => {
    try {
        const [directors] = await pool.execute('SELECT * FROM director ORDER BY director_name');
        res.json(directors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching directors', error: error.message });
    }
};

const getDirectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const [directors] = await pool.execute('SELECT * FROM director WHERE director_id = ?', [id]);
        
        if (directors.length === 0) {
            return res.status(404).json({ message: 'Director not found' });
        }
        
        res.json(directors[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching director', error: error.message });
    }
};

const getDirectorsSorted = async (req, res) => {
    try {
        const { sortBy = 'director_name', order = 'ASC' } = req.query;
        const validSortFields = ['director_name', 'director_birth_year', 'director_nationality'];
        const validOrders = ['ASC', 'DESC'];
        
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'director_name';
        const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [directors] = await pool.execute(`SELECT * FROM director ORDER BY ${sortField} ${sortOrder}`);
        res.json({
            success: true,
            count: directors.length,
            sortedBy: sortField,
            order: sortOrder,
            data: directors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sorted directors', error: error.message });
    }
};

const getDirectorsByBirthYearRange = async (req, res) => {
    try {
        const { startYear, endYear } = req.query;
        
        if (!startYear || !endYear) {
            return res.status(400).json({
                success: false,
                error: 'Both startYear and endYear query parameters are required'
            });
        }
        
        const [directors] = await pool.execute(
            'SELECT * FROM director WHERE director_birth_year BETWEEN ? AND ? ORDER BY director_birth_year ASC, director_name ASC',
            [startYear, endYear]
        );
        
        res.json({
            success: true,
            birthYearRange: `${startYear} - ${endYear}`,
            count: directors.length,
            data: directors
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching directors by birth year range', error: error.message });
    }
};

const createDirector = async (req, res) => {
    try {
        const { director_name, director_birth_year, director_nationality } = req.body;
        
        if (!director_name) {
            return res.status(400).json({ message: 'Director name is required' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO director (director_name, director_birth_year, director_nationality) VALUES (?, ?, ?)',
            [director_name, director_birth_year || null, director_nationality || null]
        );
        
        const [newDirector] = await pool.execute('SELECT * FROM director WHERE director_id = ?', [result.insertId]);
        
        res.status(201).json({
            message: 'Director created successfully',
            director: newDirector[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating director', error: error.message });
    }
};

const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { director_name, director_birth_year, director_nationality } = req.body;
        
        const [existingDirector] = await pool.execute('SELECT * FROM director WHERE director_id = ?', [id]);
        if (existingDirector.length === 0) {
            return res.status(404).json({ message: 'Director not found' });
        }
        
        if (!director_name) {
            return res.status(400).json({ message: 'Director name is required' });
        }
        
        await pool.execute(
            'UPDATE director SET director_name = ?, director_birth_year = ?, director_nationality = ? WHERE director_id = ?',
            [director_name, director_birth_year || null, director_nationality || null, id]
        );
        
        const [updatedDirector] = await pool.execute('SELECT * FROM director WHERE director_id = ?', [id]);
        
        res.json({
            message: 'Director updated successfully',
            director: updatedDirector[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating director', error: error.message });
    }
};

module.exports = {
    getAllDirectors,
    getDirectorById,
    getDirectorsSorted,
    getDirectorsByBirthYearRange,
    createDirector,
    updateDirector
};