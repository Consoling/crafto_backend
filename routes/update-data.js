const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

const verifyToken = require('../middleware/verifyToken');

router.put('/update-data', verifyToken, async (req, res) => {
  const { userID } = req.user; 
  
  console.log(req.user)
  const _id = userID;

  const updatedData = req.body;

 
  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ message: 'No data provided for update' });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, updatedData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        userID: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        language: user.language,
        accountType: user.accountType,
        isPremium: user.isPremium,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
