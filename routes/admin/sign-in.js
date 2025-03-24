const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

const router = express.Router();

router.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        return res.status(400).json({ message: 'Email or Username is required' });
    }

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    console.log(password)
    try {
        let admin;
        if (email) {
            admin = await Admin.findOne({ email });
        } else if (username) {
            admin = await Admin.findOne({ username });
        }

        if (!admin) {
            console.log('Admin not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(admin.password)

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            console.log('Password not valid');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = admin.generateAuthToken();

        res.status(200).json({
            message: 'Login successful!',
            token,
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
