// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, // Validate phone number with country code
    isVerified: Boolean,
    
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
 
  language: {
    type: String,
    default: "en",
  },
  accountType: {
    type: String,
    enum: ['Personal', 'Business'],
    default: 'Personal'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    defaultFont: { type: String, default: "Arial" },
    theme: { type: String, default: "light" }
  },
  savedTemplates: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTemplate" }]
},
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
