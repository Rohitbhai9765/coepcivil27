const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
