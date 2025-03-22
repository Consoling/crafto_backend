const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const { body, validationResult } = require('express-validator');
const User = require('../models/User');  

// POST Login route
router.post(
    '/',
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      const trimmedPassword = password.trim(); // Trim whitespace
  
      console.log("Request body:", req.body);
      console.log("Trimmed password:", trimmedPassword);
  
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'No such user found' });
        }
  
        console.log("User found in DB:", user);
        console.log("Hashed password in DB:", user.password);
  
        // const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
        const isPasswordValid = await user.isValidPassword(trimmedPassword)
        console.log("Password comparison result:", isPasswordValid);
  
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid password' });
        }
  
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          'your_jwt_secret_key',
          { expiresIn: '1h' }
        );
  
        res.status(200).json({
          message: 'Login successful',
          token
        });
      } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: 'Error during login', error: err });
      }
    }
  );

module.exports = router;
