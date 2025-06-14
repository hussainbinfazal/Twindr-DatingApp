// // import multer from 'multer';
// const multer = require('multer'); // Use require to import multer
// const path = require('path');

// // Set storage destination and filename
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Specify the folder to save the uploaded files
//         cb(null, 'uploads/profile-pictures');
//     },
//     filename: (req, file, cb) => {
//         // Specify the file name (e.g., user ID + timestamp + file extension)
//         cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
//     },

//     destination: (req, file, cb) => {
//         cb(null, 'uploads/audio/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }


// });

// // File validation (only accept image files)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true); // Accept file
//     } else {
//         cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'), false);
//     }
// };

// // Multer configuration
// const upload = multer({
//     storage: storage
// });


// module.exports = upload;


const multer = require('multer');
const path = require('path');

// Set storage destination and filename for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'profile-pictures'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Set storage destination and filename for audio files
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'audio'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter to determine which files to accept
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Create multer instances for profile pictures and audio files
const uploadProfilePicture = multer({ storage: profilePictureStorage, fileFilter });
const uploadAudio = multer({ storage: audioStorage, fileFilter });

module.exports = { uploadProfilePicture, uploadAudio };
