const express = require('express');  // Replacing import with require
const router = express.Router();
const { createMessage, updateMessageStatus, deleteMessage, getAllMessages, getMessageBetweenUser, updateMessage } = require('../controller/messageController');  // Replacing import with require
const { uploadAudio } = require('../multer/multer');
const isAuthenticated = require('../middlewares/isAuth');  

router.post('/create', isAuthenticated, uploadAudio.single('audio'), createMessage);
router.get('/', isAuthenticated, getAllMessages);
router.get('/:sender/:receiver', isAuthenticated, getMessageBetweenUser);
router.delete('/:messageId', isAuthenticated, deleteMessage);
router.put('/status/:messageId/:messageStatus', isAuthenticated, updateMessageStatus);
router.put('/:messageId', isAuthenticated, updateMessage);

module.exports = router;  
