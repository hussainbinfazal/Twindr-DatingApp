const express = require('express'); 
const { createProfile, updateProfile, deleteProfile, getProfiles, myProfile, getProfileByUserId,getProfileById } = require('../controller/profileController');  // Replacing import with require
const isAuthenticated = require('../middlewares/isAuth');  
const { uploadProfilePicture } = require('../multer/multer');  

const router = express.Router();

router.post('/create', isAuthenticated,uploadProfilePicture.single('profilePicture'), createProfile);
router.get('/profiles', isAuthenticated, getProfiles);
router.get('/user/:userId', isAuthenticated, getProfileByUserId);
router.put('/:id', isAuthenticated, uploadProfilePicture.single('profilePicture'), updateProfile);
router.delete('/:id', isAuthenticated, deleteProfile);
router.get("/:profileId", isAuthenticated, getProfileById);

module.exports = router;  
