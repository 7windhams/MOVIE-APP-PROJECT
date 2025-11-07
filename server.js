const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// routes
const actorRoutes = require('./routes/actor');
const directorRoutes = require('./routes/director');
const genreRoutes = require('./routes/genre');
const movieRoutes = require('./routes/movie');
const productionRoutes = require('./routes/production');
const streamingPlatformRoutes = require('./routes/streaming_platform');

app.use('/api/actors', actorRoutes);
app.use('/api/directors', directorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/productions', productionRoutes);
app.use('/api/streaming-platforms', streamingPlatformRoutes);

// Web routes for displaying data
app.get('/', (req, res) => {
    res.render('index', { title: 'Movie Database' });
});

// Test route to check EJS
app.get('/test', (req, res) => {
    res.render('test', { title: 'Test Page' });
});

app.get('/actors', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [actors] = await pool.execute('SELECT * FROM actor ORDER BY actor_name');
        res.render('actors', { title: 'Actors', actors: actors });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load actors' });
    }
});

app.get('/directors', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [directors] = await pool.execute('SELECT * FROM director ORDER BY director_name');
        res.render('directors', { title: 'Directors', directors: directors });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load directors' });
    }
});

app.get('/genres', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [genres] = await pool.execute('SELECT * FROM genre ORDER BY genre_name');
        res.render('genres', { title: 'Genres', genres: genres });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load genres' });
    }
});

app.get('/movies', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [movies] = await pool.execute(`
            SELECT m.*, d.director_name, p.production_name 
            FROM movie m 
            LEFT JOIN director d ON m.director_id = d.director_id 
            LEFT JOIN production p ON m.production_id = p.production_id 
            ORDER BY m.movie_title
        `);
        res.render('movies', { title: 'Movies', movies: movies });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load movies' });
    }
});

app.get('/productions', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [productions] = await pool.execute('SELECT * FROM production ORDER BY production_name');
        res.render('productions', { title: 'Productions', productions: productions });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load productions' });
    }
});

app.get('/streaming-platforms', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [platforms] = await pool.execute('SELECT * FROM streaming_platform ORDER BY streaming_platform_name');
        res.render('streaming-platforms', { title: 'Streaming Platforms', platforms: platforms });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load streaming platforms' });
    }
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [result] = await pool.execute('SELECT 1 as test');
        res.json({ 
            status: 'Database connected!', 
            test: result[0],
            message: 'SQL is working'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Database connection failed',
            error: error.message,
            message: 'SQL is NOT working - check your database setup'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;