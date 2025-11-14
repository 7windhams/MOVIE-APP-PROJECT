const { pool } = require('../config/database');

const getAllActors = async (req, res) => {
    try {
        const [actors] = await pool.execute('SELECT * FROM actor ORDER BY actor_name');
        res.json(actors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching actors', error: error.message });
    }
};

const getActorById = async (req, res) => {
    try {
        const { id } = req.params;
        const [actors] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [id]);
        
        if (actors.length === 0) {
            return res.status(404).json({ message: 'Actor not found' });
        }
        
        res.json(actors[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching actor', error: error.message });
    }
};

const getActorsSorted = async (req, res) => {
    try {
        const { sortBy = 'actor_name', order = 'ASC' } = req.query;
        const validSortFields = ['actor_name', 'actor_birth_year', 'actor_nationality'];
        const validOrders = ['ASC', 'DESC'];
        
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'actor_name';
        const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [actors] = await pool.execute(`SELECT * FROM actor ORDER BY ${sortField} ${sortOrder}`);
        res.json(actors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sorted actors', error: error.message });
    }
};

const getActorsByNationality = async (req, res) => {
    try {
        const { nationality } = req.params;
        const [actors] = await pool.execute(
            'SELECT * FROM actor WHERE actor_nationality LIKE ? ORDER BY actor_name',
            [`%${nationality}%`]
        );
        res.json(actors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching actors by nationality', error: error.message });
    }
};

const createActor = async (req, res) => {
    try {
        const { actor_name, actor_birth_year, actor_nationality } = req.body;
        
        // Validate required fields
        if (!actor_name) {
            return res.status(400).json({ message: 'Actor name is required' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES (?, ?, ?)',
            [actor_name, actor_birth_year || null, actor_nationality || null]
        );
        
        // Fetch the created actor
        const [newActor] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [result.insertId]);
        
        res.status(201).json({
            message: 'Actor created successfully',
            actor: newActor[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating actor', error: error.message });
    }
};

const updateActor = async (req, res) => {
    try {
        const { id } = req.params;
        const { actor_name, actor_birth_year, actor_nationality } = req.body;
        
        // Check if actor exists
        const [existingActor] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [id]);
        if (existingActor.length === 0) {
            return res.status(404).json({ message: 'Actor not found' });
        }
        
        // Validate required fields
        if (!actor_name) {
            return res.status(400).json({ message: 'Actor name is required' });
        }
        
        await pool.execute(
            'UPDATE actor SET actor_name = ?, actor_birth_year = ?, actor_nationality = ? WHERE actor_id = ?',
            [actor_name, actor_birth_year || null, actor_nationality || null, id]
        );
        
        // Fetch the updated actor
        const [updatedActor] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [id]);
        
        res.json({
            message: 'Actor updated successfully',
            actor: updatedActor[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating actor', error: error.message });
    }
};

module.exports = {
    getAllActors,
    getActorById,
    getActorsSorted,
    getActorsByNationality,
    createActor,
    updateActor
};