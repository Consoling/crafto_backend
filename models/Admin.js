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
  token: {
    type: String,
    default: null,
  },
  tokenCreatedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});


adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
}
adminSchema.methods.generateAuthToken = function () {
  const payload = { userId: this._id, role: this.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  
  this.token = token; 
  this.tokenCreatedAt = new Date(); 
  return token;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
