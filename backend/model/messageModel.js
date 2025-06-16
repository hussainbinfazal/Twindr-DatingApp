const mongoose = require('mongoose'); 
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
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

module.exports = Message;  