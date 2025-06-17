const express = require('express');  // Replacing import with require
const router = express.Router();
const { getMatches,SwipeRight,acceptMatch, unmatchProfile, getProfiles, deleteMatchWithUser } = require('../controller/matchController');  // Replacing import with require
const isAuthenticated  = require('../middlewares/isAuth');  



// Create a Match

router.get('/matches',isAuthenticated,getMatches );
router.post('/swipe-left/:id',isAuthenticated, unmatchProfile)
router.post('/swipe-right/:id',isAuthenticated,SwipeRight)
router.post('/match/:id',isAuthenticated, deleteMatchWithUser);




module.exports = router; 