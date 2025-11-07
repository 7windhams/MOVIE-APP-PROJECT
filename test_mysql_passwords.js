const mysql = require('mysql2/promise');

// Common MySQL password combinations
const passwordOptions = [
    { user: 'root', password: '' },
    { user: 'root', password: 'root' },
    { user: 'root', password: 'Sdw$1956' },
    { user: 'root', password: 'admin' },
    { user: 'root', password: 'mysql' },
    { user: 'root', password: '123456' }
];

async function findWorkingCredentials() {
    console.log('Testing MySQL credentials...\n');
    
    for (let i = 0; i < passwordOptions.length; i++) {
        const { user, password } = passwordOptions[i];
        
        try {
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: user,
                password: password
            });
            
            console.log(`✅ SUCCESS! Working credentials found:`);
            console.log(`   User: ${user}`);
            console.log(`   Password: "${password}"`);
            console.log(`\nUpdate your .env file with:`);
            console.log(`DB_USER=${user}`);
            console.log(`DB_PASSWORD=${password}`);
            
            await connection.end();
            return;
            
        } catch (error) {
            console.log(`❌ Failed: user="${user}", password="${password}"`);
        }
    }
    
    console.log('\n🚨 No working credentials found. You may need to:');
    console.log('1. Install XAMPP or MySQL');
    console.log('2. Start the MySQL service');
    console.log('3. Reset your MySQL root password');
}

findWorkingCredentials();