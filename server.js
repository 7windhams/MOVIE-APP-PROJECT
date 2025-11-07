const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    res.json({ message: 'Movie API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;