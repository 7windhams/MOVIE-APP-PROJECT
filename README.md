# Susan's Movie Database Project 🎬

Hey! This is my movie database API that I built during my time at Mississippi Coding Academies. It's been quite a journey learning backend development, and I'm excited to share this project with you!

## What This Project Does

This is a web application that manages movie data - think actors, directors, movies, genres, and all that good stuff. I built it using Node.js and MySQL, and honestly, I learned a ton while making it.
- Error handling and validation
- MySQL database integration

## Project Structure

```
movie-app-project/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   ├── actorController.js   # Actor business logic
│   ├── directorController.js # Director business logic
│   ├── genreController.js   # Genre business logic
│   ├── movieController.js   # Movie business logic (with pivot joins)
│   ├── productionController.js # Production business logic
│   └── streamingPlatformController.js # Streaming platform business logic
├── middleware/              # Custom middleware (future use)
├── routes/
│   ├── actor.js            # Actor routes
│   ├── director.js         # Director routes
│   ├── genre.js           # Genre routes
│   ├── movie.js           # Movie routes
│   ├── production.js      # Production routes
│   └── streaming_platform.js # Streaming platform routes
├── views/                  # EJS templates (future use)
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
├── README.md             # This file
└── server.js             # Main server file
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Configure your database settings in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=movie_database
   PORT=3000
   NODE_ENV=development
   ```
5. Start the server:
   ```bash
   npm start
   # or for development with nodemon:
   npm run dev
   ```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
- `GET /health` - Check API and database status

### Actors
- `GET /api/actors` - Get all actors
- `GET /api/actors/:id` - Get actor by ID
- `GET /api/actors/sorted?sortBy=field&order=ASC|DESC` - Get sorted actors
- `GET /api/actors/nationality/:nationality` - Get actors by nationality

### Directors
- `GET /api/directors` - Get all directors
- `GET /api/directors/:id` - Get director by ID
- `GET /api/directors/sorted?sortBy=field&order=ASC|DESC` - Get sorted directors
- `GET /api/directors/birth-year-range?startYear=1950&endYear=1980` - Get directors by birth year range

### Genres
- `GET /api/genres` - Get all genres
- `GET /api/genres/:id` - Get genre by ID
- `GET /api/genres/sorted?sortBy=field&order=ASC|DESC` - Get sorted genres
- `GET /api/genres/with-movie-count` - Get genres with movie count

### Movies (Complex Queries with Pivot Tables)
- `GET /api/movies` - Get all movies with director and production info
- `GET /api/movies/:id` - Get movie by ID with all related data (actors, genres, streaming platforms)
- `GET /api/movies/sorted?sortBy=field&order=ASC|DESC` - Get sorted movies
- `GET /api/movies/genre/:genre` - Get movies by genre with actor count

### Productions
- `GET /api/productions` - Get all productions
- `GET /api/productions/:id` - Get production by ID
- `GET /api/productions/sorted?sortBy=field&order=ASC|DESC` - Get sorted productions
- `GET /api/productions/with-movie-stats` - Get productions with movie statistics

### Streaming Platforms
- `GET /api/streaming-platforms` - Get all streaming platforms
- `GET /api/streaming-platforms/:id` - Get streaming platform by ID
- `GET /api/streaming-platforms/sorted?sortBy=field&order=ASC|DESC` - Get sorted streaming platforms
- `GET /api/streaming-platforms/with-analytics` - Get streaming platforms with analytics

## Sorting Options

Most endpoints support sorting with query parameters:
- `sortBy`: Field name to sort by
- `order`: ASC (ascending) or DESC (descending)

Example: `/api/actors/sorted?sortBy=actor_name&order=DESC`

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Database Schema

The API expects the following database tables:
- `actor` (actor_id, actor_name, actor_birth_year, actor_nationality)
- `director` (director_id, director_name, director_birth_year, director_nationality)
- `genre` (genre_id, genre_name, genre_description)
- `production` (production_id, production_name, production_founded_year, production_headquarters)
- `streaming_platform` (streaming_platform_id, streaming_platform_name, streaming_platform_launch_year, streaming_platform_subscription_cost)
- `movie` (movie_id, movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id)

### Pivot Tables:
- `movie_actor` (movie_id, actor_id)
- `movie_genre` (movie_id, genre_id)
- `movie_streaming_platform` (movie_id, streaming_platform_id)

## Development

- Built with Node.js and Express.js
- MySQL2 for database operations
- Helmet for security headers
- CORS for cross-origin requests
- Environment variable support with dotenv

## Security Features

- Input validation and sanitization
- SQL injection prevention
- Security headers with Helmet
- CORS configuration
- Error handling middleware

## Future Enhancements

- POST, PATCH, and DELETE endpoints
- EJS views for web interface
- Authentication and authorization
- API rate limiting
- Data validation middleware
- Comprehensive testing suite

## License

ISC