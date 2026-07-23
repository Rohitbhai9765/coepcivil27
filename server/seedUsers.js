const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

// Define all users and their EMAILS here.
// When a user logs in via Clerk, we will match their email to this list.
const usersToSeed = [
  {
    email: 'rohitb23.civil@coeptech.ac.in', // Replace with actual email
    role: 'master_admin',
    subjectIds: [] // Master admin doesn't need specific subject IDs
  },
  {
    email: 'abhimanyuab23.civil@coeptech.ac.in', // Replace with actual email
    role: 'cr',
    subjectIds: []
  },
  {
    email: 'tagadesm23.civil@coeptech.ac.in', // Replace with actual email
    role: 'lr',
    subjectIds: []
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Do not clear existing users to prevent data loss
    // We will only add or update users below

    try {
      await User.collection.dropIndex('username_1');
      console.log('Dropped old username index');
    } catch (e) {
      // Ignore if index doesn't exist
    }

    for (const userData of usersToSeed) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        // Update roles if user exists
        existingUser.role = userData.role;
        existingUser.subjectIds = userData.subjectIds;
        await existingUser.save();
        console.log(`Updated user: ${userData.email}`);
      } else {
        // Create new user
        const newUser = new User({
          email: userData.email,
          role: userData.role,
          subjectIds: userData.subjectIds
        });
        await newUser.save();
        console.log(`Created user: ${userData.email}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
