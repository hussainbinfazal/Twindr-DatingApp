const express = require('express');  // Replacing import with require
const router = express.Router();
const { getMatches,SwipeRight,acceptMatch, unmatchProfile, getProfiles, deleteMatchWithUser } = require('../controller/matchController');  // Replacing import with require
const isAuthenticated  = require('../middlewares/isAuth');  // Replacing import with require


router.use(isAuthenticated);
// Create a Match

router.get('/matches',getMatches );
router.post('/swipe-left/:id', unmatchProfile)
router.post('/swipe-right/:id',SwipeRight)
router.post('/match/:id', deleteMatchWithUser);




module.exports = router;  // Replacing export default with module.exports
