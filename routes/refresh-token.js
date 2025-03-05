const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');  

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
const JWT_EXPIRATION = '4h';  

router.post('/', (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    const refreshToken = authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, username: decoded.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }  
        );

        User.findByIdAndUpdate(decoded.userId, { _accessToken: newAccessToken }, { new: true })
            .then((user) => {
                res.status(200).json({ accessToken: newAccessToken });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error updating access token' });
            });
    });
});

module.exports = router;
