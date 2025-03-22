const multer = require('multer');
const path = require('path');
const fs = require('fs');


const avatarsDirectory = 'uploads/avatars/';
if (!fs.existsSync(avatarsDirectory)) {
  fs.mkdirSync(avatarsDirectory, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, avatarsDirectory);
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
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 },  // 25MB file size limit
});

module.exports = upload;
