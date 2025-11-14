const { pool } = require('../config/database');

const getAllGenres = async (req, res) => {
    try {
        const [genres] = await pool.execute('SELECT * FROM genre ORDER BY genre_name ASC');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genres', error: error.message });
    }
};

const getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        const [genres] = await pool.execute('SELECT * FROM genre WHERE genre_id = ?', [id]);
        
        if (genres.length === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        
        res.json(genres[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genre', error: error.message });
    }
};

const getGenresSorted = async (req, res) => {
    try {
        const { sortBy = 'genre_name', order = 'ASC' } = req.query;
        const validSortFields = ['genre_name', 'genre_description'];
        const validOrders = ['ASC', 'DESC'];
        
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'genre_name';
        const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [genres] = await pool.execute(`SELECT * FROM genre ORDER BY ${sortField} ${sortOrder}`);
        res.json({
            success: true,
            count: genres.length,
            sortedBy: sortField,
            order: sortOrder,
            data: genres
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sorted genres', error: error.message });
    }
};

const getGenresWithMovieCount = async (req, res) => {
    try {
        const [genres] = await pool.execute(`
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
            count: genres.length,
            data: genres
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genres with movie count', error: error.message });
    }
};

const createGenre = async (req, res) => {
    try {
        const { genre_name, genre_description } = req.body;
        
        if (!genre_name) {
            return res.status(400).json({ message: 'Genre name is required' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO genre (genre_name, genre_description) VALUES (?, ?)',
            [genre_name, genre_description || null]
        );
        
        const [newGenre] = await pool.execute('SELECT * FROM genre WHERE genre_id = ?', [result.insertId]);
        
        res.status(201).json({
            message: 'Genre created successfully',
            genre: newGenre[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating genre', error: error.message });
    }
};

const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { genre_name, genre_description } = req.body;
        
        const [existingGenre] = await pool.execute('SELECT * FROM genre WHERE genre_id = ?', [id]);
        if (existingGenre.length === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        
        if (!genre_name) {
            return res.status(400).json({ message: 'Genre name is required' });
        }
        
        await pool.execute(
            'UPDATE genre SET genre_name = ?, genre_description = ? WHERE genre_id = ?',
            [genre_name, genre_description || null, id]
        );
        
        const [updatedGenre] = await pool.execute('SELECT * FROM genre WHERE genre_id = ?', [id]);
        
        res.json({
            message: 'Genre updated successfully',
            genre: updatedGenre[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating genre', error: error.message });
    }
};

module.exports = {
    getAllGenres,
    getGenreById,
    getGenresSorted,
    getGenresWithMovieCount,
    createGenre,
    updateGenre
};