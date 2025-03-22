const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token || token === null || token === undefined) {
    console.log('No token provided, authorization denied');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // Set userId from token payload
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Route for updating the avatar
router.put('/', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    // Check if the file is uploaded
    if (!req.file) {
      console.log('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded, please select an image.' });
    } else {
      console.log('File uploaded:', req.file); 
    }

    const userId = req.userId; 
    const profilePicture = req.file ? req.file.path : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture }, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Avatar updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
