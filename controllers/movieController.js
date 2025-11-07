const { pool } = require('../config/database');

const getAllMovies = async (req, res) => {
    try {
        // Try different possible table names
        let query = 'SELECT * FROM movie LIMIT 10';
        const [movies] = await pool.execute(query);
        res.json(movies);
    } catch (error) {
        // If 'movie' table doesn't exist, try 'movies'
        try {
            const [movies] = await pool.execute('SELECT * FROM movies LIMIT 10');
            res.json(movies);
        } catch (error2) {
            console.log('Movie table error:', error.message);
            res.status(500).json({ 
                error: 'Movie table not found',
                message: 'Check if your database has a movie or movies table'
            });
        }
    }
};

const getMovieById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const [result] = await pool.execute('SELECT * FROM movie WHERE movie_id = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(result[0]);
    } catch (error) {
        try {
            // Try with movies table
            const [result] = await pool.execute('SELECT * FROM movies WHERE id = ?', [id]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.json(result[0]);
        } catch (error2) {
            res.status(500).json({ error: 'Database error' });
        }
    }
};

const getMoviesSorted = async (req, res) => {
    try {
        const [movies] = await pool.execute('SELECT * FROM movie ORDER BY movie_title');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Sort failed' });
    }
};

const getMoviesByGenre = async (req, res) => {
    try {
        const [movies] = await pool.execute('SELECT * FROM movie LIMIT 10');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get movies by genre' });
    }
};

module.exports = {
    getAllMovies,
    getMovieById, 
    getMoviesSorted,
    getMoviesByGenre
};