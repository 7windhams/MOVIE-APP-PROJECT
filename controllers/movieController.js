const { pool } = require('../config/database');

// Get all movies with basic info
const getAllMovies = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                m.*,
                d.director_name,
                p.production_name
            FROM movie m
            LEFT JOIN director d ON m.director_id = d.director_id
            LEFT JOIN production p ON m.production_id = p.production_id
            ORDER BY m.movie_title ASC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching all movies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movies',
            message: error.message
        });
    }
};

// Get movie by ID with all related data (actors, genres, streaming platforms)
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get basic movie info
        const [movieRows] = await pool.execute(`
            SELECT 
                m.*,
                d.director_name,
                p.production_name
            FROM movie m
            LEFT JOIN director d ON m.director_id = d.director_id
            LEFT JOIN production p ON m.production_id = p.production_id
            WHERE m.movie_id = ?
        `, [id]);
        
        if (movieRows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Movie not found'
            });
        }
        
        const movie = movieRows[0];
        
        // Get movie actors
        const [actorRows] = await pool.execute(`
            SELECT a.*
            FROM actor a
            INNER JOIN movie_actor ma ON a.actor_id = ma.actor_id
            WHERE ma.movie_id = ?
            ORDER BY a.actor_name ASC
        `, [id]);
        
        // Get movie genres
        const [genreRows] = await pool.execute(`
            SELECT g.*
            FROM genre g
            INNER JOIN movie_genre mg ON g.genre_id = mg.genre_id
            WHERE mg.movie_id = ?
            ORDER BY g.genre_name ASC
        `, [id]);
        
        // Get movie streaming platforms
        const [streamingRows] = await pool.execute(`
            SELECT sp.*
            FROM streaming_platform sp
            INNER JOIN movie_streaming_platform msp ON sp.streaming_platform_id = msp.streaming_platform_id
            WHERE msp.movie_id = ?
            ORDER BY sp.streaming_platform_name ASC
        `, [id]);
        
        // Combine all data
        movie.actors = actorRows;
        movie.genres = genreRows;
        movie.streaming_platforms = streamingRows;
        
        res.json({
            success: true,
            data: movie
        });
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movie',
            message: error.message
        });
    }
};

// Get movies sorted by specific field
const getMoviesSorted = async (req, res) => {
    try {
        const { sortBy = 'movie_title', order = 'ASC' } = req.query;
        
        // Validate sort field to prevent SQL injection
        const allowedSortFields = ['movie_id', 'movie_title', 'movie_release_year', 'movie_runtime', 'movie_rating'];
        const validSortField = allowedSortFields.includes(sortBy) ? sortBy : 'movie_title';
        const validOrder = ['ASC', 'DESC'].includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';
        
        const [rows] = await pool.execute(`
            SELECT 
                m.*,
                d.director_name,
                p.production_name
            FROM movie m
            LEFT JOIN director d ON m.director_id = d.director_id
            LEFT JOIN production p ON m.production_id = p.production_id
            ORDER BY m.${validSortField} ${validOrder}
        `);
        
        res.json({
            success: true,
            count: rows.length,
            sortedBy: validSortField,
            order: validOrder,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching sorted movies:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sorted movies',
            message: error.message
        });
    }
};

// Custom endpoint: Get movies by genre with actor count
const getMoviesByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        
        const [rows] = await pool.execute(`
            SELECT 
                m.*,
                d.director_name,
                p.production_name,
                g.genre_name,
                COUNT(DISTINCT ma.actor_id) as actor_count
            FROM movie m
            LEFT JOIN director d ON m.director_id = d.director_id
            LEFT JOIN production p ON m.production_id = p.production_id
            INNER JOIN movie_genre mg ON m.movie_id = mg.movie_id
            INNER JOIN genre g ON mg.genre_id = g.genre_id
            LEFT JOIN movie_actor ma ON m.movie_id = ma.movie_id
            WHERE LOWER(g.genre_name) LIKE LOWER(?)
            GROUP BY m.movie_id, m.movie_title, m.movie_release_year, m.movie_runtime, 
                     m.movie_rating, m.director_id, m.production_id, d.director_name, 
                     p.production_name, g.genre_name
            ORDER BY m.movie_title ASC
        `, [`%${genre}%`]);
        
        res.json({
            success: true,
            genre: genre,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch movies by genre',
            message: error.message
        });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    getMoviesSorted,
    getMoviesByGenre
};