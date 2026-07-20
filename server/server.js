require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// 1. Get all attendance records
app.get('/api/attendance', async (req, res) => {
  try {
    const { subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ error: 'subjectId is required' });
    }

    const records = await Attendance.find({ subjectId });
    // Transform DB array into the key-value map the frontend expects
    const attendanceMap = {};
    records.forEach(record => {
      attendanceMap[record.date] = {
        presentStudents: record.presentStudents,
        lectureConducted: record.lectureConducted ?? false // Default to false if missing
      };
    });
    res.json(attendanceMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// 2. Save or update attendance for a specific date
app.post('/api/attendance', async (req, res) => {
  try {
    const { date, subjectId, presentStudents, lectureConducted = false } = req.body;
    
    if (!subjectId) {
      return res.status(400).json({ error: 'subjectId is required' });
    }
    
    // Upsert: Create if it doesn't exist, update if it does
    await Attendance.findOneAndUpdate(
      { date, subjectId },
      { presentStudents, lectureConducted },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Attendance saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save attendance' });
  }
});

// 3. Get Current User Profile (Clerk Auth)
app.get('/api/me', ClerkExpressRequireAuth({}), async (req, res) => {
  try {
    const { userId } = req.auth;
    
    // Fetch user details from Clerk to get their email
    const clerkUser = await clerkClient.users.getUser(userId);
    const emailAddress = clerkUser.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return res.status(400).json({ error: 'No email address found for this user' });
    }

    // Look up the user in our MongoDB by email
    const dbUser = await User.findOne({ email: emailAddress });
    
    if (!dbUser) {
      // User logged in via Clerk, but they are not authorized in our MongoDB
      return res.status(403).json({ error: 'User is not authorized in the system' });
    }

    res.json({ 
      success: true, 
      user: {
        email: dbUser.email,
        role: dbUser.role,
        subjectIds: dbUser.subjectIds
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: `Internal server error during authentication: ${error.message}`, details: error.message });
  }
});

// Error handling middleware for Clerk
app.use((err, req, res, next) => {
  if (err.message === 'Unauthenticated') {
    res.status(401).json({ error: 'Unauthenticated' });
  } else {
    next(err);
  }
});

const path = require('path');
const fs = require('fs');

// Serve static frontend files (Only if building monolithic)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Catch-all to serve index.html for React Router
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
