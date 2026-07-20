const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

// Define all users and their passwords here.
// IMPORTANT: Change these passwords before running the script!
const usersToSeed = [
  {
    username: 'adminRSB',
    password: 'Rsb@admin26', // Change this
    role: 'master_admin',
    subjectIds: [] // Master admin doesn't need specific subject IDs
  },
  {
    username: 'CR',
    password: 'Abhi@26', // Change this
    role: 'cr',
    subjectIds: []
  },
  {
    username: 'LR',
    password: 'Sam@26', // Change this
    role: 'lr',
    subjectIds: []
  },
  // Professors mapped to their subjects
  {
    username: 'Prof_pr_patil',
    password: 'Prpatil@26', // Change this
    role: 'professor',
    subjectIds: ['qsv']
  },
  {
    username: 'Prof_mu_khobragade',
    password: 'Mukhobragade@26', // Change this
    role: 'professor',
    subjectIds: ['ee']
  },
  {
    username: 'Prof_s_singh',
    password: 'Ssingh@26', // Change this
    role: 'professor',
    subjectIds: ['rm']
  },
  {
    username: 'Prof_vb_dawari',
    password: 'Vbdawari@26', // Change this
    role: 'professor',
    subjectIds: ['iee']
  },
  {
    username: 'Prof_ar_akhare',
    password: 'Arakhare@26', // Change this
    role: 'professor',
    subjectIds: ['pcs']
  },
  {
    username: 'Prof_rs_dalvi',
    password: 'Rsdalvi@26', // Change this
    role: 'professor',
    subjectIds: ['afe']
  },
  {
    username: 'Prof_se_shinde',
    password: 'Seshinde@26', // Change this
    role: 'professor',
    subjectIds: ['bim']
  },
  {
    username: 'Prof_gs_vyas',
    password: 'Gsvyas@26', // Change this
    role: 'professor',
    subjectIds: ['ctm']
  },
  {
    username: 'Prof_nm_mohite',
    password: 'Nmmohite@26', // Change this
    role: 'professor',
    subjectIds: ['dhs']
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Optional: Clear existing users (uncomment if you want to reset users every time)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    for (const userData of usersToSeed) {
      // Check if user already exists
      const existingUser = await User.findOne({ username: userData.username });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      if (existingUser) {
        // Update password and roles if user exists
        existingUser.password = hashedPassword;
        existingUser.role = userData.role;
        existingUser.subjectIds = userData.subjectIds;
        await existingUser.save();
        console.log(`Updated user: ${userData.username}`);
      } else {
        // Create new user
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          subjectIds: userData.subjectIds
        });
        await newUser.save();
        console.log(`Created user: ${userData.username}`);
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
