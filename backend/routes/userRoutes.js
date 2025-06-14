const express = require('express');  // Replacing import with require
const { createUser, getAllUsers, getUserById, updateUser, myProfile, loginUser, logoutUser, useAuthenticationToken } = require('../controller/userController');  // Replacing import with require
const isAuthenticated = require('../middlewares/isAuth');  // Replacing import with require

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/register', createUser);
router.post('/login', loginUser);   
router.post('/logout', isAuthenticated, logoutUser);   
// router.get('/:id', isAuthenticated, getUserById);
// router.get('/my', isAuthenticated, myProfile);
router.get('/me', isAuthenticated, useAuthenticationToken);
router.put('/:id', isAuthenticated, updateUser);

module.exports = router;  // Replacing export default with module.exports
