const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Susan's Movie Database API - built during coding bootcamp
// This project showcases my backend development skills
const app = express();
const PORT = process.env.PORT || 3002; // Changed to 3002

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

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

// Form routes for adding new data
app.get('/forms', (req, res) => {
    res.render('forms-index', { title: 'Data Entry Forms' });
});

app.get('/forms/actor', async (req, res) => {
    res.render('actor-form', { title: 'Add New Actor', actor: null, isEdit: false });
});

app.get('/forms/actor/:id', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [actors] = await pool.execute('SELECT * FROM actor WHERE actor_id = ?', [req.params.id]);
        if (actors.length === 0) {
            return res.render('error', { title: 'Error', error: 'Actor not found' });
        }
        res.render('actor-form', { title: 'Edit Actor', actor: actors[0], isEdit: true });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load actor' });
    }
});

app.get('/forms/director', (req, res) => {
    res.render('director-form', { title: 'Add New Director', director: null, isEdit: false });
});

app.get('/forms/director/:id', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [directors] = await pool.execute('SELECT * FROM director WHERE director_id = ?', [req.params.id]);
        if (directors.length === 0) {
            return res.render('error', { title: 'Error', error: 'Director not found' });
        }
        res.render('director-form', { title: 'Edit Director', director: directors[0], isEdit: true });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load director' });
    }
});

app.get('/forms/genre', (req, res) => {
    res.render('genre-form', { title: 'Add New Genre', genre: null, isEdit: false });
});

app.get('/forms/genre/:id', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [genres] = await pool.execute('SELECT * FROM genre WHERE genre_id = ?', [req.params.id]);
        if (genres.length === 0) {
            return res.render('error', { title: 'Error', error: 'Genre not found' });
        }
        res.render('genre-form', { title: 'Edit Genre', genre: genres[0], isEdit: true });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load genre' });
    }
});

app.get('/forms/production', (req, res) => {
    res.render('production-form', { title: 'Add New Production', production: null, isEdit: false });
});

app.get('/forms/production/:id', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [productions] = await pool.execute('SELECT * FROM production WHERE production_id = ?', [req.params.id]);
        if (productions.length === 0) {
            return res.render('error', { title: 'Error', error: 'Production not found' });
        }
        res.render('production-form', { title: 'Edit Production', production: productions[0], isEdit: true });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load production' });
    }
});

app.get('/forms/movie', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [directors] = await pool.execute('SELECT * FROM director ORDER BY director_name');
        const [productions] = await pool.execute('SELECT * FROM production ORDER BY production_name');
        res.render('movie-form', { 
            title: 'Add New Movie', 
            movie: null, 
            isEdit: false, 
            directors: directors, 
            productions: productions 
        });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load form data' });
    }
});

app.get('/forms/movie/:id', async (req, res) => {
    const { pool } = require('./config/database');
    try {
        const [movies] = await pool.execute('SELECT * FROM movie WHERE movie_id = ?', [req.params.id]);
        if (movies.length === 0) {
            return res.render('error', { title: 'Error', error: 'Movie not found' });
        }
        const [directors] = await pool.execute('SELECT * FROM director ORDER BY director_name');
        const [productions] = await pool.execute('SELECT * FROM production ORDER BY production_name');
        res.render('movie-form', { 
            title: 'Edit Movie', 
            movie: movies[0], 
            isEdit: true, 
            directors: directors, 
            productions: productions 
        });
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to load movie' });
    }
});

// Handle form submissions
app.post('/forms/actor', async (req, res) => {
    const { actor_name, actor_birth_year, actor_nationality } = req.body;
    try {
        const response = await fetch('http://localhost:3002/api/actors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actor_name, actor_birth_year, actor_nationality })
        });
        if (response.ok) {
            res.redirect('/actors?success=Actor added successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to add actor' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to add actor' });
    }
});

app.post('/forms/actor/:id', async (req, res) => {
    const { actor_name, actor_birth_year, actor_nationality } = req.body;
    try {
        const response = await fetch(`http://localhost:3002/api/actors/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actor_name, actor_birth_year, actor_nationality })
        });
        if (response.ok) {
            res.redirect('/actors?success=Actor updated successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to update actor' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to update actor' });
    }
});

app.post('/forms/director', async (req, res) => {
    const { director_name, director_birth_year, director_nationality } = req.body;
    try {
        const response = await fetch('http://localhost:3002/api/directors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ director_name, director_birth_year, director_nationality })
        });
        if (response.ok) {
            res.redirect('/directors?success=Director added successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to add director' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to add director' });
    }
});

app.post('/forms/director/:id', async (req, res) => {
    const { director_name, director_birth_year, director_nationality } = req.body;
    try {
        const response = await fetch(`http://localhost:3002/api/directors/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ director_name, director_birth_year, director_nationality })
        });
        if (response.ok) {
            res.redirect('/directors?success=Director updated successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to update director' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to update director' });
    }
});

app.post('/forms/genre', async (req, res) => {
    const { genre_name, genre_description } = req.body;
    try {
        const response = await fetch('http://localhost:3002/api/genres', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ genre_name, genre_description })
        });
        if (response.ok) {
            res.redirect('/genres?success=Genre added successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to add genre' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to add genre' });
    }
});

app.post('/forms/genre/:id', async (req, res) => {
    const { genre_name, genre_description } = req.body;
    try {
        const response = await fetch(`http://localhost:3002/api/genres/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ genre_name, genre_description })
        });
        if (response.ok) {
            res.redirect('/genres?success=Genre updated successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to update genre' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to update genre' });
    }
});

app.post('/forms/production', async (req, res) => {
    const { production_name, production_founded_year, production_headquarters } = req.body;
    try {
        const response = await fetch('http://localhost:3002/api/productions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ production_name, production_founded_year, production_headquarters })
        });
        if (response.ok) {
            res.redirect('/productions?success=Production added successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to add production' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to add production' });
    }
});

app.post('/forms/production/:id', async (req, res) => {
    const { production_name, production_founded_year, production_headquarters } = req.body;
    try {
        const response = await fetch(`http://localhost:3002/api/productions/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ production_name, production_founded_year, production_headquarters })
        });
        if (response.ok) {
            res.redirect('/productions?success=Production updated successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to update production' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to update production' });
    }
});

app.post('/forms/movie', async (req, res) => {
    const { movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id } = req.body;
    try {
        const response = await fetch('http://localhost:3002/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                movie_title, 
                movie_release_year: movie_release_year || null, 
                movie_runtime: movie_runtime || null, 
                movie_rating: movie_rating || null, 
                director_id: director_id || null, 
                production_id: production_id || null 
            })
        });
        if (response.ok) {
            res.redirect('/movies?success=Movie added successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to add movie' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to add movie' });
    }
});

app.post('/forms/movie/:id', async (req, res) => {
    const { movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id } = req.body;
    try {
        const response = await fetch(`http://localhost:3002/api/movies/${req.params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                movie_title, 
                movie_release_year: movie_release_year || null, 
                movie_runtime: movie_runtime || null, 
                movie_rating: movie_rating || null, 
                director_id: director_id || null, 
                production_id: production_id || null 
            })
        });
        if (response.ok) {
            res.redirect('/movies?success=Movie updated successfully');
        } else {
            res.render('error', { title: 'Error', error: 'Failed to update movie' });
        }
    } catch (error) {
        res.render('error', { title: 'Error', error: 'Failed to update movie' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;