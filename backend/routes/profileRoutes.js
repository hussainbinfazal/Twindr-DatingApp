const express = require('express');  // Replacing import with require
const { createProfile, updateProfile, deleteProfile, getProfiles, myProfile, getProfileByUserId,getProfileById } = require('../controller/profileController');  // Replacing import with require
const isAuthenticated = require('../middlewares/isAuth');  // Replacing import with require
const { uploadProfilePicture } = require('../multer/multer');  // Replacing import with require

const router = express.Router();

// Create Profile
router.post('/create', isAuthenticated,uploadProfilePicture.single('profilePicture'), createProfile);

router.get('/profiles', isAuthenticated, getProfiles);

// router.delete('/:id', isAuthenticated, myProfile);

router.get('/user/:userId', isAuthenticated, getProfileByUserId);

// Update Profile (with Profile Image upload)
router.put('/:id', isAuthenticated, uploadProfilePicture.single('profilePicture'), updateProfile);

// Delete Profile
router.delete('/:id', isAuthenticated, deleteProfile);
router.get("/:profileId", isAuthenticated, getProfileById);

module.exports = router;  // Replacing export default with module.exports
