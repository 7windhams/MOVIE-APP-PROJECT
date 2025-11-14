const { pool } = require('../config/database');

const getAllMovies = async (req, res) => {
    try {
        const [movies] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            ORDER BY m.movie_title
        `);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const [movies] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            WHERE m.movie_id = ?
        `, [id]);
        
        if (movies.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        res.json(movies[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie', error: error.message });
    }
};

const getMoviesSorted = async (req, res) => {
    try {
        const { sortBy = 'movie_title', order = 'ASC' } = req.query;
        const validSortFields = ['movie_title', 'movie_release_year', 'movie_runtime', 'movie_rating'];
        const validOrders = ['ASC', 'DESC'];
        
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'movie_title';
        const sortOrder = validOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [movies] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            ORDER BY m.${sortField} ${sortOrder}
        `);
        
        res.json({
            success: true,
            count: movies.length,
            sortedBy: sortField,
            order: sortOrder,
            data: movies
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sorted movies', error: error.message });
    }
};

const getMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const [movies] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name, g.genre_name
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id
            JOIN movie_genre mg ON m.movie_id = mg.movie_id
            JOIN genre g ON mg.genre_id = g.genre_id
            WHERE g.genre_name LIKE ?
            ORDER BY m.movie_title
        `, [`%${genre}%`]);
        
        res.json({
            success: true,
            genre: genre,
            count: movies.length,
            data: movies
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies by genre', error: error.message });
    }
};

const createMovie = async (req, res) => {
    try {
        const { movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id } = req.body;
        
        if (!movie_title) {
            return res.status(400).json({ message: 'Movie title is required' });
        }
        
        const [result] = await pool.execute(
            'INSERT INTO movie (movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id) VALUES (?, ?, ?, ?, ?, ?)',
            [movie_title, movie_release_year || null, movie_runtime || null, movie_rating || null, director_id || null, production_id || null]
        );
        
        const [newMovie] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            WHERE m.movie_id = ?
        `, [result.insertId]);
        
        res.status(201).json({
            message: 'Movie created successfully',
            movie: newMovie[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating movie', error: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id } = req.body;
        
        const [existingMovie] = await pool.execute('SELECT * FROM movie WHERE movie_id = ?', [id]);
        if (existingMovie.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        if (!movie_title) {
            return res.status(400).json({ message: 'Movie title is required' });
        }
        
        await pool.execute(
            'UPDATE movie SET movie_title = ?, movie_release_year = ?, movie_runtime = ?, movie_rating = ?, director_id = ?, production_id = ? WHERE movie_id = ?',
            [movie_title, movie_release_year || null, movie_runtime || null, movie_rating || null, director_id || null, production_id || null, id]
        );
        
        const [updatedMovie] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            WHERE m.movie_id = ?
        `, [id]);
        
        res.json({
            message: 'Movie updated successfully',
            movie: updatedMovie[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating movie', error: error.message });
    }
};

module.exports = {
    getAllMovies,
    getMovieById, 
    getMoviesSorted,
    getMoviesByGenre,
    createMovie,
    updateMovie
};