const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId; 
    if (!userId) {
      return cb(new Error('User ID is required'), null);
    }

    const fileExtension = path.extname(file.originalname); 
    const fileName = `${userId}${fileExtension}`; 
    cb(null, fileName);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    console.log(file.mimetype)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, 
});

module.exports = upload;