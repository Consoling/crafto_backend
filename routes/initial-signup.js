// routes/auth.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/', async (req, res) => {
    const { phoneNumber, password } = req.body;

    
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
        // Check if the phone number is already taken
        const existingUser = await User.findOne({ phoneNumber });

        // If the user exists and is not verified, resend OTP
        if (existingUser) {
            if (!existingUser.isVerified) {
                // Send OTP to verify the phone number
                await client.verify.v2.services(process.env.TWILIO_SID).verifications.create({
                    channel: "sms",
                    to: `${phoneNumber}`
                });

                return res.status(200).json({ message: 'OTP sent for verification' });
            } else {
                return res.status(400).json({ message: 'Phone number already verified' });
            }
        }

        // If phone number doesn't exist, create a new user
        const newUser = new User({
            phoneNumber,
            password,
        });

        // Send OTP to the new user for verification
        await client.verify.v2.services(process.env.TWILIO_SID).verifications.create({
            channel: "sms",
            to: `${phoneNumber}`
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User signed up successfully, OTP sent for verification' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
