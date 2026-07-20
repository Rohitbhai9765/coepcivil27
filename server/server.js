require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const bcrypt = require('bcrypt');
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

// 3. Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, generate a JWT token. Here we simulate a token.
    res.json({ 
      success: true, 
      token: `token-${user._id}`,
      user: {
        username: user.username,
        role: user.role,
        subjectIds: user.subjectIds
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
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
