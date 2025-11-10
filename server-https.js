const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
require('dotenv').config();

// Susan's Movie Database API - built during coding bootcamp
// This project showcases my backend development skills
const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3002;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

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

// Function to create HTTPS server if certificates exist
function startServers() {
    // Start HTTP server
    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, () => {
        console.log(`🌐 HTTP Server running on port ${HTTP_PORT}`);
        console.log(`   Visit: http://localhost:${HTTP_PORT}`);
    });

    // Try to start HTTPS server if certificates exist
    try {
        const certPath = path.join(__dirname, 'certificates');
        const privateKey = fs.readFileSync(path.join(certPath, 'private.key'), 'utf8');
        const certificate = fs.readFileSync(path.join(certPath, 'certificate.crt'), 'utf8');
        
        const credentials = {
            key: privateKey,
            cert: certificate
        };

        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(HTTPS_PORT, () => {
            console.log(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
            console.log(`   Visit: https://localhost:${HTTPS_PORT}`);
        });
    } catch (error) {
        console.log(`⚠️  HTTPS certificates not found. Only HTTP server started.`);
        console.log(`   To enable HTTPS, run: npm run create-cert`);
    }
}

startServers();

module.exports = app;