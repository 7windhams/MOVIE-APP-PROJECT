const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        console.log('🚀 Creating movie database step by step...\n');
        
        // Connect without database first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Step 1: Create database
        await connection.execute('CREATE DATABASE IF NOT EXISTS movie_database');
        console.log('🗄️  Database "movie_database" created');
        
        // Step 2: Use the database
        await connection.execute('USE movie_database');
        console.log('📂 Switched to movie_database');
        
        // Step 3: Create tables
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
        console.log('✅ Actor table created');
        
        // Director table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS director (
                director_id INT PRIMARY KEY AUTO_INCREMENT,
                director_name VARCHAR(255) NOT NULL,
                director_birth_year INT,
                director_nationality VARCHAR(100)
            )
        `);
        console.log('✅ Director table created');
        
        // Genre table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS genre (
                genre_id INT PRIMARY KEY AUTO_INCREMENT,
                genre_name VARCHAR(100) NOT NULL,
                genre_description TEXT
            )
        `);
        console.log('✅ Genre table created');
        
        // Production table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS production (
                production_id INT PRIMARY KEY AUTO_INCREMENT,
                production_name VARCHAR(255) NOT NULL,
                production_founded_year INT,
                production_headquarters VARCHAR(255)
            )
        `);
        console.log('✅ Production table created');
        
        // Streaming platform table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS streaming_platform (
                streaming_platform_id INT PRIMARY KEY AUTO_INCREMENT,
                streaming_platform_name VARCHAR(255) NOT NULL,
                streaming_platform_launch_year INT,
                streaming_platform_subscription_cost DECIMAL(10,2)
            )
        `);
        console.log('✅ Streaming platform table created');
        
        // Movie table
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
        console.log('✅ Movie table created');
        
        // Step 4: Insert sample data
        console.log('\n📥 Inserting sample data...');
        
        // Insert actors
        await connection.execute(`
            INSERT IGNORE INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES
            ('Tom Hanks', 1956, 'American'),
            ('Leonardo DiCaprio', 1974, 'American'),
            ('Meryl Streep', 1949, 'American'),
            ('Brad Pitt', 1963, 'American'),
            ('Jennifer Lawrence', 1990, 'American')
        `);
        console.log('✅ Sample actors inserted');
        
        // Insert directors
        await connection.execute(`
            INSERT IGNORE INTO director (director_name, director_birth_year, director_nationality) VALUES
            ('Christopher Nolan', 1970, 'British'),
            ('Steven Spielberg', 1946, 'American'),
            ('Martin Scorsese', 1942, 'American'),
            ('Quentin Tarantino', 1963, 'American')
        `);
        console.log('✅ Sample directors inserted');
        
        // Insert genres
        await connection.execute(`
            INSERT IGNORE INTO genre (genre_name, genre_description) VALUES
            ('Action', 'High energy films with lots of excitement'),
            ('Drama', 'Character-driven stories with emotional depth'),
            ('Comedy', 'Films designed to make audiences laugh'),
            ('Thriller', 'Suspenseful and exciting movies'),
            ('Sci-Fi', 'Science fiction and futuristic themes')
        `);
        console.log('✅ Sample genres inserted');
        
        // Insert production companies
        await connection.execute(`
            INSERT IGNORE INTO production (production_name, production_founded_year, production_headquarters) VALUES
            ('Warner Bros', 1923, 'Burbank, California'),
            ('Universal Pictures', 1912, 'Universal City, California'),
            ('Paramount Pictures', 1912, 'Hollywood, California'),
            ('Columbia Pictures', 1924, 'Culver City, California')
        `);
        console.log('✅ Sample production companies inserted');
        
        // Insert streaming platforms
        await connection.execute(`
            INSERT IGNORE INTO streaming_platform (streaming_platform_name, streaming_platform_launch_year, streaming_platform_subscription_cost) VALUES
            ('Netflix', 2007, 15.99),
            ('Amazon Prime Video', 2006, 12.99),
            ('Disney+', 2019, 7.99),
            ('HBO Max', 2020, 14.99),
            ('Hulu', 2007, 11.99)
        `);
        console.log('✅ Sample streaming platforms inserted');
        
        await connection.end();
        
        // Test the setup
        console.log('\n🧪 Testing database setup...');
        await testFinalSetup();
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
    }
}

async function testFinalSetup() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: 'movie_database'
        });
        
        const [actors] = await connection.execute('SELECT COUNT(*) as count FROM actor');
        const [directors] = await connection.execute('SELECT COUNT(*) as count FROM director');
        const [genres] = await connection.execute('SELECT COUNT(*) as count FROM genre');
        const [productions] = await connection.execute('SELECT COUNT(*) as count FROM production');
        const [platforms] = await connection.execute('SELECT COUNT(*) as count FROM streaming_platform');
        
        console.log('📊 Database contains:');
        console.log(`  🎭 Actors: ${actors[0].count} records`);
        console.log(`  🎬 Directors: ${directors[0].count} records`);
        console.log(`  🎪 Genres: ${genres[0].count} records`);
        console.log(`  🏭 Productions: ${productions[0].count} records`);
        console.log(`  📺 Streaming Platforms: ${platforms[0].count} records`);
        
        console.log('\n🎭 Sample actors:');
        const [actorList] = await connection.execute('SELECT actor_name, actor_birth_year, actor_nationality FROM actor LIMIT 3');
        actorList.forEach(actor => {
            console.log(`  - ${actor.actor_name} (${actor.actor_birth_year}) - ${actor.actor_nationality}`);
        });
        
        await connection.end();
        console.log('\n🎉 SUCCESS! Database is ready!');
        console.log('🌐 Now visit: http://localhost:3002/actors');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    }
}

createDatabase();