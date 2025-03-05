const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '4h'; 
const REFRESH_TOKEN_EXPIRATION = '7d';

router.post('/', async (req, res) => {
    const { phoneNumber } = req.body;
    console.log(phoneNumber)
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {

        const user = await User.findOne({ phoneNumber });
        var redirectTo = ''

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create JWT Access Token (short-lived)
        const accessToken = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber, isVerified: user.isVerified },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        // Create JWT Refresh Token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber },
            JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION }
        );

        if (user.username) {
            redirectTo = '/home';
        } else {
            redirectTo = '/user-handle-creation';
        }
        

        if (accessToken && refreshToken) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
        } else {
            return res.status(404).json({ message: " Failed to store tokens " })
        }

        await user.save();

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'Strict',
        });

        // Send the access token to the client
        res.status(200).json({
            message: 'Token generated successfully',
            accessToken,
            userId: user._id,
            redirectTo: redirectTo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;