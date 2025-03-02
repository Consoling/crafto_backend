
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


router.post('/', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }

    try {
        
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        
        await client.verify.v2.services(process.env.TWILIO_SID).verifications.create({
            channel: 'sms',
            to: `+${phoneNumber}`,
        });

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
