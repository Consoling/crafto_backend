const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/'); 
  },
  filename: (req, file, cb) => {

    const userId = req.userId; 
    
    if (!userId) {
      return cb(new Error('User ID is required'), null);
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${userId}${fileExtension}`;
    cb(null, fileName);
  },
});


const fileFilter = (req, file, cb) => {
  console.log(file.mimetype); 
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file if it's an image
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};

// Initialize Multer with storage configuration and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // Limit file size to 25MB
});

module.exports = upload;
