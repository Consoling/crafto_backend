const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model

// Middleware to verify JWT token (if authentication is required)
const verifyToken = require('../middleware/verifyToken'); // Example middleware

// GET route to fetch user data
router.get('/', verifyToken, async (req, res) => {
    const { userID } = req.params; // Extract userID from the route parameter
    const _id = userID;
    try {
        // Query the user data from MongoDB by userID
        const user = await User.findById(_id).select(
            'username userID phoneNumber email language accountType isPremium isVerified'
        );

        // If no user is found
        if (!user) {
            console.log('usernotFound')
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        res.status(200).json({
            userID: user._id,
            username: user.username,
            phoneNumber: user.phoneNumber,
            email: user.email,
            language: user.language,
            accountType: user.accountType,
            isPremium: user.isPremium,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
