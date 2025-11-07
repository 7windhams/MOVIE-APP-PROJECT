const { pool } = require('./config/database');

// Sample actor data
const actorData = [
    {"actor_id": 1, "actor_name": "Tom Hanks", "actor_birth_year": 1956, "actor_nationality": "American"},
    {"actor_id": 2, "actor_name": "Leonardo DiCaprio", "actor_birth_year": 1974, "actor_nationality": "American"},
    {"actor_id": 3, "actor_name": "Meryl Streep", "actor_birth_year": 1949, "actor_nationality": "American"}
];

async function importActors() {
    try {
        console.log('🎬 Starting actor data import...');
        
        // Check if actors table exists and show current data
        console.log('\n📊 Checking current actors in database...');
        const [existingActors] = await pool.execute('SELECT * FROM actor ORDER BY actor_id');
        console.log(`Found ${existingActors.length} existing actors in database`);
        
        if (existingActors.length > 0) {
            console.log('Current actors:');
            existingActors.forEach(actor => {
                console.log(`  - ${actor.actor_name} (ID: ${actor.actor_id})`);
            });
        }
        
        console.log('\n✨ Importing new actor data...');
        
        // Insert each actor
        for (const actor of actorData) {
            try {
                const [result] = await pool.execute(
                    'INSERT INTO actor (actor_id, actor_name, actor_birth_year, actor_nationality) VALUES (?, ?, ?, ?)',
                    [actor.actor_id, actor.actor_name, actor.actor_birth_year, actor.actor_nationality]
                );
                console.log(`✅ Successfully added: ${actor.actor_name}`);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`⚠️  Actor ${actor.actor_name} already exists (ID: ${actor.actor_id})`);
                } else {
                    console.log(`❌ Error adding ${actor.actor_name}:`, error.message);
                }
            }
        }
        
        // Show final results
        console.log('\n🎯 Import complete! Final actor count:');
        const [finalActors] = await pool.execute('SELECT COUNT(*) as count FROM actor');
        console.log(`Total actors in database: ${finalActors[0].count}`);
        
        // Display all actors
        const [allActors] = await pool.execute('SELECT * FROM actor ORDER BY actor_name');
        console.log('\nAll actors in database:');
        allActors.forEach(actor => {
            console.log(`  🎭 ${actor.actor_name} (${actor.actor_birth_year}) - ${actor.actor_nationality}`);
        });
        
    } catch (error) {
        console.error('❌ Database error:', error.message);
        console.log('\n💡 Make sure your database is running and the actor table exists.');
    } finally {
        await pool.end();
        console.log('\n🔚 Database connection closed.');
    }
}

// Run the import
importActors();