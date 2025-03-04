const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

const verifyToken = require('../middleware/verifyToken');

router.get('/data/:userID', verifyToken, async (req, res) => {
    const { userID } = req.params; 
    console.log(req.params)
    const _id = userID;
    try {
        const user = await User.findById(_id).select(
            'username userID phoneNumber email language accountType isPremium isVerified'
        );

       
        if (!user) {
            console.log('usernotFound')
            return res.status(404).json({ message: 'User not found' });
        }

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
