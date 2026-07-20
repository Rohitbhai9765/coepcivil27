const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['master_admin', 'professor', 'cr', 'lr']
  },
  subjectIds: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('User', UserSchema);
