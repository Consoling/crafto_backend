const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../../models/Admin');
const AdminIP = require('../../models/AdminIPLog');

const router = express.Router();

router.use(express.json());

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields (username, email, password) are required.' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    const ipAddress = req.ip;

    const newAdminIP = new AdminIP({
      adminId: newAdmin._id,
      ipAddress: ipAddress,
    });

    await newAdminIP.save();

    res.status(201).json({
      message: 'Admin created successfully!',
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
