// routes/auth.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/', async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
        const existingUser = await User.findOne({ phoneNumber });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        if (isPasswordCorrect) {
            try {
                await client.verify.v2.services(process.env.TWILIO_SID).verifications.create({
                    channel: "sms",
                    to: `${phoneNumber}`
                });

                return res.status(201).json({ message: 'OTP sent for verification' });

            } catch (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ message: 'Failed to send OTP, please try again later' });
            }
        }


        return res.status(201).json({
            message: 'Login successful',
            userId: existingUser._id,
            phoneNumber: existingUser.phoneNumber,
            isVerified: existingUser.isVerified
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
