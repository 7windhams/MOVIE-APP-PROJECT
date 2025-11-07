const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
    let connection;
    try {
        console.log('🚀 Creating database and tables...\n');
        
        // Connect to MySQL server (without database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS movie_database');
        console.log('🗄️  Database "movie_database" created/verified');
        
        // Close connection and reconnect to the specific database
        await connection.end();
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: 'movie_database'
        });
        console.log('📂 Connected to movie_database');
        
        // Create tables one by one
        console.log('\n📋 Creating tables...');
        
        // Actor table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS actor (
                actor_id INT PRIMARY KEY AUTO_INCREMENT,
                actor_name VARCHAR(255) NOT NULL,
                actor_birth_year INT,
                actor_nationality VARCHAR(100)
            )
        `);
        console.log('✓ Actor table created');
        
        // Director table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS director (
                director_id INT PRIMARY KEY AUTO_INCREMENT,
                director_name VARCHAR(255) NOT NULL,
                director_birth_year INT,
                director_nationality VARCHAR(100)
            )
        `);
        console.log('✓ Director table created');
        
        // Genre table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS genre (
                genre_id INT PRIMARY KEY AUTO_INCREMENT,
                genre_name VARCHAR(100) NOT NULL,
                genre_description TEXT
            )
        `);
        console.log('✓ Genre table created');
        
        // Production table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS production (
                production_id INT PRIMARY KEY AUTO_INCREMENT,
                production_name VARCHAR(255) NOT NULL,
                production_founded_year INT,
                production_headquarters VARCHAR(255)
            )
        `);
        console.log('✓ Production table created');
        
        // Streaming platform table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS streaming_platform (
                streaming_platform_id INT PRIMARY KEY AUTO_INCREMENT,
                streaming_platform_name VARCHAR(255) NOT NULL,
                streaming_platform_launch_year INT,
                streaming_platform_subscription_cost DECIMAL(10,2)
            )
        `);
        console.log('✓ Streaming platform table created');
        
        // Movie table (with foreign keys)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS movie (
                movie_id INT PRIMARY KEY AUTO_INCREMENT,
                movie_title VARCHAR(255) NOT NULL,
                movie_release_year INT,
                movie_runtime INT,
                movie_rating DECIMAL(3,1),
                director_id INT,
                production_id INT,
                FOREIGN KEY (director_id) REFERENCES director(director_id),
                FOREIGN KEY (production_id) REFERENCES production(production_id)
            )
        `);
        console.log('✓ Movie table created');
        
        // Junction tables
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS movie_actor (
                movie_id INT,
                actor_id INT,
                PRIMARY KEY (movie_id, actor_id),
                FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
                FOREIGN KEY (actor_id) REFERENCES actor(actor_id)
            )
        `);
        console.log('✓ Movie-Actor junction table created');
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS movie_genre (
                movie_id INT,
                genre_id INT,
                PRIMARY KEY (movie_id, genre_id),
                FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
                FOREIGN KEY (genre_id) REFERENCES genre(genre_id)
            )
        `);
        console.log('✓ Movie-Genre junction table created');
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS movie_streaming_platform (
                movie_id INT,
                streaming_platform_id INT,
                PRIMARY KEY (movie_id, streaming_platform_id),
                FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
                FOREIGN KEY (streaming_platform_id) REFERENCES streaming_platform(streaming_platform_id)
            )
        `);
        console.log('✓ Movie-Streaming Platform junction table created');
        
        console.log('\n📥 Inserting sample data...');
        
        // Insert sample data
        await connection.execute(`
            INSERT IGNORE INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES
            ('Tom Hanks', 1956, 'American'),
            ('Leonardo DiCaprio', 1974, 'American'),
            ('Meryl Streep', 1949, 'American'),
            ('Denzel Washington', 1954, 'American'),
            ('Scarlett Johansson', 1984, 'American')
        `);
        console.log('✓ Sample actors inserted');
        
        await connection.execute(`
            INSERT IGNORE INTO director (director_name, director_birth_year, director_nationality) VALUES
            ('Christopher Nolan', 1970, 'British'),
            ('Steven Spielberg', 1946, 'American'),
            ('Martin Scorsese', 1942, 'American'),
            ('Quentin Tarantino', 1963, 'American'),
            ('Greta Gerwig', 1983, 'American')
        `);
        console.log('✓ Sample directors inserted');
        
        await connection.execute(`
            INSERT IGNORE INTO genre (genre_name, genre_description) VALUES
            ('Action', 'High energy films with lots of excitement'),
            ('Drama', 'Character-driven stories with emotional depth'),
            ('Comedy', 'Films designed to make audiences laugh'),
            ('Thriller', 'Suspenseful films that keep you on edge'),
            ('Sci-Fi', 'Science fiction and futuristic stories')
        `);
        console.log('✓ Sample genres inserted');
        
        await connection.execute(`
            INSERT IGNORE INTO production (production_name, production_founded_year, production_headquarters) VALUES
            ('Warner Bros', 1923, 'Burbank, California'),
            ('Disney', 1923, 'Burbank, California'),
            ('Universal Pictures', 1912, 'Universal City, California'),
            ('Paramount Pictures', 1912, 'Hollywood, California'),
            ('Sony Pictures', 1987, 'Culver City, California')
        `);
        console.log('✓ Sample productions inserted');
        
        await connection.execute(`
            INSERT IGNORE INTO streaming_platform (streaming_platform_name, streaming_platform_launch_year, streaming_platform_subscription_cost) VALUES
            ('Netflix', 2007, 15.99),
            ('Amazon Prime', 2006, 12.99),
            ('Disney+', 2019, 7.99),
            ('HBO Max', 2020, 14.99),
            ('Hulu', 2007, 11.99)
        `);
        console.log('✓ Sample streaming platforms inserted');
        
        // Insert some movies
        await connection.execute(`
            INSERT IGNORE INTO movie (movie_title, movie_release_year, movie_runtime, movie_rating, director_id, production_id) VALUES
            ('Inception', 2010, 148, 8.8, 1, 1),
            ('Forrest Gump', 1994, 142, 8.8, 2, 3),
            ('The Wolf of Wall Street', 2013, 180, 8.2, 3, 3),
            ('Pulp Fiction', 1994, 154, 8.9, 4, 4)
        `);
        console.log('✓ Sample movies inserted');
        
        console.log('\n🧪 Testing database setup...');
        
        // Test the setup
        const [actors] = await connection.execute('SELECT COUNT(*) as count FROM actor');
        const [directors] = await connection.execute('SELECT COUNT(*) as count FROM director');
        const [genres] = await connection.execute('SELECT COUNT(*) as count FROM genre');
        const [movies] = await connection.execute('SELECT COUNT(*) as count FROM movie');
        
        console.log('📊 Database test results:');
        console.log(`  🎭 Actors: ${actors[0].count} records`);
        console.log(`  🎬 Directors: ${directors[0].count} records`);
        console.log(`  🎪 Genres: ${genres[0].count} records`);
        console.log(`  🎥 Movies: ${movies[0].count} records`);
        
        console.log('\n✅ Database setup successful! Your movie app is ready to use!');
        console.log('🌐 Visit http://localhost:3002/actors to see the actors page');
        console.log('🌐 Visit http://localhost:3002/movies to see the movies page');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.error('Full error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createTables();