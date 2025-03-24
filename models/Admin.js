// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    default: 'admin',
  },
}, {
  timestamps: true, 
});


adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next(); 
  }
  
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
