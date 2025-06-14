const mongoose = require('mongoose');  // Replacing import with require

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true,
    },
    message: {
        type: String,
        
    },
    messageStatus: {
        type: String,
        enum: ['sent', 'delivered', 'seen','error'],
        default: 'sent',
    },
    type: { type: String, enum: ['text', 'audio'], default: 'text' },
    audioUrl: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;  // Replacing export default with module.exports
