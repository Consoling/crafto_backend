const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const verifyToken = require('../middleware/verifyToken');


router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; 
        
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        user.accessToken = null;  
        user.refreshToken = null; 

        
        await user.save();

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
        });

        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
