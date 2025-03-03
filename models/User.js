// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for a user
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, // Validate phone number with country code
    isVerified: Boolean
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  accessToken: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  },
  language: {
    type: String,
    default: "en",
  },
  accountType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  isPremium: {
    type: Boolean,
    default: false
  }
});

// Encrypt the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password (for login purposes)
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
