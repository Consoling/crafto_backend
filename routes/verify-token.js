const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


router.get('/', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ authenticated: false, message: 'No refresh token found' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);

        // Find the user associated with the token
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ authenticated: false, message: 'Invalid refresh token' });
        }

        // Optionally, generate a new access token
        // const accessToken = jwt.sign(
        //     { userId: user._id, phoneNumber: user.phoneNumber, isVerified: user.isVerified },
        //     JWT_SECRET,
        //     { expiresIn: '4h' } // Access token expires in 4 hours
        // );

        // Send the response with user info
        res.status(200).json({
            authenticated: true,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                username: user.username,
                isVerified: user.isVerified,
            },
            accessToken,
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(401).json({ authenticated: false, message: 'Invalid or expired refresh token' });
    }
});

module.exports = router;
