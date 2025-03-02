// routes/otp-auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Endpoint to verify OTP
router.post('/', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    console.log(phoneNumber, otp);

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    try {

        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_SID)
            .verificationChecks
            .create({ to: `${phoneNumber}`, code: otp });

        if (verificationCheck.status === 'approved') {
            const user = await User.findOne({ phoneNumber });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }


            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
