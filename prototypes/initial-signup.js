const express = require('express');
const User = require('../models/User');
const router = express.Router();
const axios = require('axios');

// Fast2SMS API configuration
const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';

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
                // Send OTP using Fast2SMS
                const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
                const response = await sendOTP(phoneNumber, otp);

                if (response.return) {
                    // Save the OTP to the user document (optional)
                    existingUser.otp = otp;
                    await existingUser.save();

                    return res.status(200).json({ message: 'OTP sent for verification' });
                } else {
                    return res.status(500).json({ message: 'Failed to send OTP' });
                }
            } else {
                return res.status(400).json({ message: 'Phone number already verified' });
            }
        }

        // If phone number doesn't exist, create a new user
        const newUser = new User({
            phoneNumber,
            password,
        });


        const otp = Math.floor(100000 + Math.random() * 900000); // To Generate a 6-digit OTP
        const response = await sendOTP(phoneNumber, otp);

        if (response.return) {


            await newUser.save();

            // Respond with success message
            res.status(201).json({ message: 'User signed up successfully, OTP sent for verification' });
        } else {
            res.status(500).json({ message: 'Failed to send OTP' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Function to send OTP using Fast2SMS API
async function sendOTP(phoneNumber, otp) {
    try {
        const response = await axios.post(
            FAST2SMS_URL,
            {
                sender_id: 'FSTSMS', // Replace with your approved sender ID

                route: 'otp',
                numbers: phoneNumber,

                variables_values: otp,
            },
            {
                headers: {
                    authorization: FAST2SMS_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = router;