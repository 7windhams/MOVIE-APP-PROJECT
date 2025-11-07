const path = require('path');
const { pool } = require(path.join(__dirname, '..', 'config', 'database'));

// Generic function to import actors from JSON data
async function importActorsFromJSON(actorArray) {
    try {
        console.log(`🎬 Importing ${actorArray.length} actors...`);
        
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        
        for (const actor of actorArray) {
            try {
                // Validate required fields
                if (!actor.actor_name) {
                    console.log(`⚠️  Skipping actor - missing name:`, actor);
                    skipCount++;
                    continue;
                }
                
                const [result] = await pool.execute(
                    'INSERT INTO actor (actor_name, actor_birth_year, actor_nationality) VALUES (?, ?, ?)',
                    [
                        actor.actor_name,
                        actor.actor_birth_year || null,
                        actor.actor_nationality || null
                    ]
                );
                
                console.log(`✅ Added: ${actor.actor_name} (ID: ${result.insertId})`);
                successCount++;
                
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`⚠️  Already exists: ${actor.actor_name}`);
                    skipCount++;
                } else {
                    console.log(`❌ Error adding ${actor.actor_name}:`, error.message);
                    errorCount++;
                }
            }
        }
        
        console.log('\n📊 Import Summary:');
        console.log(`  ✅ Successfully added: ${successCount}`);
        console.log(`  ⚠️  Skipped (duplicates): ${skipCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        
        return { successCount, skipCount, errorCount };
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        throw error;
    }
}

// Test with your provided data
const testActors = [
    {"actor_id":1,"actor_name":"Tom Hanks","actor_birth_year":1956,"actor_nationality":"American"},
    {"actor_id":2,"actor_name":"Leonardo DiCaprio","actor_birth_year":1974,"actor_nationality":"American"},
    {"actor_id":3,"actor_name":"Meryl Streep","actor_birth_year":1949,"actor_nationality":"American"}
];

// Run the import if this file is executed directly
if (require.main === module) {
    async function main() {
        try {
            console.log('🚀 Starting actor import process...\n');
            await importActorsFromJSON(testActors);
            
            // Show final count
            const [count] = await pool.execute('SELECT COUNT(*) as total FROM actor');
            console.log(`\n🎯 Total actors in database: ${count[0].total}`);
            
        } catch (error) {
            console.error('💥 Import process failed:', error.message);
        } finally {
            await pool.end();
            console.log('🔚 Connection closed.');
        }
    }
    
    main();
}

module.exports = { importActorsFromJSON };