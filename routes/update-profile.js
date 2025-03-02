const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {

    
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token)// Extract token from "Bearer <token>"

    if (!token || token === null || token === undefined) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


router.put('/', verifyToken, async (req, res) => {
    const { userId, username } = req.body;
    
    console.log('Request Body be like: ',req.body)



    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) {
            user.username = username;
        }

        // if (profilePicture) {
        //     user.profilePicture = profilePicture;
        // }

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                username: user.username,
                // profilePicture: user.profilePicture,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
