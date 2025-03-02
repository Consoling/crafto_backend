const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const User = require('../models/User')



// File upload hander (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Add timestamp to avoid name clashes
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;  // Allowed image file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);  // Allow file
    } else {
      return cb(new Error('Invalid file type. Only jpg, jpeg, png, and gif are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }  // Max file size 5MB
});


/* POST Sign-Up route. */
router.post(
  '/',
  body('fullName').isLength({ min: 3 }).withMessage('Full name is required and should be at least 3 characters long'),
  body('mobileNumber')
    .isNumeric().withMessage('Mobile number must be numeric')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .withMessage('Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  upload.single('profilePicture'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, mobileNumber, email, password } = req.body;
    const trimmedPassword = password.trim(); 
    const profilePicture = req.file ? req.file.path : null;

    console.log("Request body:", req.body);
    console.log("Trimmed password:", trimmedPassword);

    User.findOne({ email })
      .then(userExists => {
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }

        console.log("Plaintext password before hashing:", trimmedPassword);
        bcrypt.hash(trimmedPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
          }

          console.log("Hashed password:", hashedPassword);

          const newUser = new User({
            fullName,
            mobileNumber,
            email,
            password: hashedPassword,
            profilePicture,
          });

          newUser
            .save()
            .then(user => {
              res.status(201).json({ message: 'User signed up successfully', user });
            })
            .catch(err => {
              res.status(500).json({ message: 'Error saving user to database', error: err });
            });
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error finding user', error: err });
      });
  }
);




module.exports = router;
