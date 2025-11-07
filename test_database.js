const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection and tables...\n');
        
        // Test connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'movie_database'
        });
        
        console.log('✅ Database connection successful!');
        console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
        
        // Check if tables exist
        const tables = ['actor', 'director', 'genre', 'movie', 'production', 'streaming_platform'];
        
        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`✅ Table '${table}' exists - ${rows[0].count} records`);
            } catch (error) {
                console.log(`❌ Table '${table}' does not exist or error: ${error.message}`);
            }
        }
        
        // Test a simple query on actor table
        try {
            const [actors] = await connection.execute('SELECT * FROM actor LIMIT 3');
            console.log('\n🎭 Sample actors from database:');
            if (actors.length > 0) {
                actors.forEach(actor => {
                    console.log(`  - ${actor.actor_name} (ID: ${actor.actor_id})`);
                });
            } else {
                console.log('  No actors found in database');
            }
        } catch (error) {
            console.log(`❌ Error querying actors: ${error.message}`);
        }
        
        await connection.end();
        console.log('\n🔚 Database test completed!');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n💡 Possible solutions:');
        console.log('1. Make sure MySQL server is running');
        console.log('2. Check if database "movie_database" exists');
        console.log('3. Verify database credentials in .env file');
        console.log('4. Create the database and tables if they don\'t exist');
    }
}

testDatabase();