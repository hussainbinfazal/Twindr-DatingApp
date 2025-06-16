const express = require('express');  
const { createUser, getAllUsers, getUserById, updateUser, myProfile, loginUser, logoutUser, useAuthenticationToken } = require('../controller/userController');  // Replacing import with require
const isAuthenticated = require('../middlewares/isAuth'); 

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/register', createUser);
router.post('/login', loginUser);   
router.post('/logout', isAuthenticated, logoutUser);   

router.get('/me', isAuthenticated, useAuthenticationToken);
router.put('/:id', isAuthenticated, updateUser);

module.exports = router;  
