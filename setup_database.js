const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        console.log('🚀 Setting up movie database...\n');
        
        // First connect without specifying database to create it
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD
        });
        
        console.log('✅ Connected to MySQL server');
        
        // Read and execute the database setup SQL
        const sqlFile = path.join(__dirname, 'database_setup.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');
        
        // Split SQL by semicolons and execute each statement
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Executing ${statements.length} SQL statements...\n`);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                if (statement.toUpperCase().includes('USE movie_database')) {
                    console.log('📂 Switching to movie_database...');
                }
                
                const [result] = await connection.execute(statement);
                
                if (statement.toUpperCase().includes('CREATE DATABASE')) {
                    console.log('🗄️  Database "movie_database" created');
                } else if (statement.toUpperCase().includes('CREATE TABLE')) {
                    const tableName = statement.match(/CREATE TABLE.*?`?(\w+)`?/i)?.[1];
                    console.log(`📋 Table "${tableName}" created`);
                } else if (statement.toUpperCase().includes('INSERT INTO')) {
                    const tableName = statement.match(/INSERT INTO.*?`?(\w+)`?/i)?.[1];
                    console.log(`📥 Sample data inserted into "${tableName}"`);
                } else if (statement.toUpperCase().includes('SELECT')) {
                    if (result && result[0] && result[0].status) {
                        console.log('🎉 ' + result[0].status);
                    }
                }
            } catch (error) {
                console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
            }
        }
        
        await connection.end();
        
        // Test the setup
        console.log('\n🧪 Testing database setup...');
        await testDatabaseSetup();
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
    }
}

async function testDatabaseSetup() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: 'movie_database'
        });
        
        // Test each table
        const [actors] = await connection.execute('SELECT COUNT(*) as count FROM actor');
        const [directors] = await connection.execute('SELECT COUNT(*) as count FROM director');
        const [genres] = await connection.execute('SELECT COUNT(*) as count FROM genre');
        
        console.log('📊 Database test results:');
        console.log(`  🎭 Actors: ${actors[0].count} records`);
        console.log(`  🎬 Directors: ${directors[0].count} records`);
        console.log(`  🎪 Genres: ${genres[0].count} records`);
        
        await connection.end();
        console.log('\n✅ Database setup successful! Your movie app is ready to use!');
        console.log('🌐 Visit http://localhost:3002/actors to see the actors page');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    }
}

setupDatabase();