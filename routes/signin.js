const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '4h';
const REFRESH_TOKEN_EXPIRATION = '28d';

router.post('/', async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ phoneNumber });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // Create JWT Access Token (short-lived)
        const accessToken = jwt.sign(
            { userId: existingUser._id, phoneNumber: existingUser.phoneNumber, isVerified: existingUser.isVerified },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Create JWT Refresh Token (long-lived)
        const refreshToken = jwt.sign(
            { userId: existingUser._id, phoneNumber: existingUser.phoneNumber },
            JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        // Save tokens to the user document
        existingUser.accessToken = accessToken;
        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        // Set the refresh token in a cookie
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'Strict',
        });

        // Determine the redirect path based on whether the user has a username
        const redirectTo = existingUser.username ? '/home' : '/user-handle-creation';

        // Send the response
        res.status(200).json({
            message: 'Login successful',    
            accessToken,
            userId: existingUser._id,
            redirectTo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;