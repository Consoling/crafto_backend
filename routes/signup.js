const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '4h';
const REFRESH_TOKEN_EXPIRATION = '7d';

router.post('/', async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  try {
    // Check if the phone number is already taken
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      // If the user exists, create a session
      const accessToken = jwt.sign(
        { userId: existingUser._id, phoneNumber: existingUser.phoneNumber, isVerified: existingUser.isVerified },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        { userId: existingUser._id, phoneNumber: existingUser.phoneNumber },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );

      existingUser.accessToken = accessToken;
      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict',
      });

      const redirectTo = existingUser.username ? '/home' : '/user-handle-creation';

      return res.status(200).json({
        message: 'User logged in successfully',
        accessToken,
        userId: existingUser._id,
        redirectTo,
      });
    } else {
      // If phone number doesn't exist, create a new user
      const newUser = new User({
        phoneNumber,
        password,
      });

      await newUser.save();

      // Create JWT Access Token (short-lived)
      const accessToken = jwt.sign(
        { userId: newUser._id, phoneNumber: newUser.phoneNumber, isVerified: newUser.isVerified },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      // Create JWT Refresh Token (long-lived)
      const refreshToken = jwt.sign(
        { userId: newUser._id, phoneNumber: newUser.phoneNumber },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRATION }
      );

      newUser.accessToken = accessToken;
      newUser.refreshToken = refreshToken;
      await newUser.save();

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict',
      });

      const redirectTo = newUser.username ? '/home' : '/user-handle-creation';

      res.status(201).json({
        message: 'User signed up successfully',
        accessToken,
        userId: newUser._id,
        // createdAt: newUser.createdAt, 
        redirectTo,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;