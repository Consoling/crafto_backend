
const mongoose = require('mongoose');

const adminIPSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference to Admin schema
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminIP = mongoose.model('AdminIP', adminIPSchema);

module.exports = AdminIP;
