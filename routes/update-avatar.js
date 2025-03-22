const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';


const verifyToken = (req, res, next) => {


    const token = req.headers['authorization']?.split(' ')[1];


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



router.put('/', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.userId;
        const profilePicture = req.file ? req.file.path : null;

        // Update the user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture }, // Update the profilePicture field
            { new: true }, // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Avatar updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;