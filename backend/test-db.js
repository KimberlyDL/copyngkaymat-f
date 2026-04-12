// Load your .env variables so Sequelize knows the database credentials
require('dotenv').config(); 

// Import your User model
const { User } = require('./src/model'); 

async function checkUsers() {
    try {
        console.log('Connecting to database...');
        
        // Fetch all users
        const users = await User.findAll({
            // Let's just grab the important fields to keep the output clean
            attributes: ['id', 'email', 'password', 'name', 'role', 'account_status'] 
        });

        console.log(`\n✅ Success! Found ${users.length} users in the database.`);
        
        if (users.length > 0) {
            console.log('\n--- User Data ---');
            // Convert Sequelize objects to plain JSON and print them nicely
            console.dir(users.map(u => u.toJSON()), { depth: null, colors: true });
        } else {
            console.log('The Users table is empty. You need to run your seeders or register a new user!');
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Failed to connect or fetch users:', error.message);
        process.exit(1);
    }
}

checkUsers();