
const Message = require("../model/messageModel");  
const { getIo, getConnectedUsers } = require("../socket/socket.server");

// Create a Message

const createMessage = async (req, res) => {
    try {
        const { sender, receiver, message, type, time, messageStatus } = req.body;
        let newMessage;
        if (type === 'audio') {
            if (!req.file) {
                return res.status(400).json({ message: 'No audio file uploaded' });
            }
            const audioUrl = `/uploads/audio/${req.file.filename}`; // Assuming you save the file path in the database
            newMessage = await Message.create({ sender, receiver, time, audioUrl, type, messageStatus: 'sent' });

        } else {
            newMessage = await Message.create({ sender, receiver, message, time, type, messageStatus: 'sent' });
        }
        // const newMessage = await Message.create({ sender, receiver, message, time ,audioUrl,type });
        const io = getIo();
        const connectedUsers = getConnectedUsers(); // Access the function directly
        const receiverSocketId = connectedUsers.get(receiver);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);  // Emit the 'newMessage' event to the receiver's socketnewMessage);
        }
        res.status(201).json({

            message: newMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Message Status Update
const updateMessageStatus = async (req, res) => {
    try {
        const { messageId, messageStatus } = req.params;
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { messageStatus },
            { new: true }
        );

        const io = getIo();
        const connectedUsers = getConnectedUsers();
        const receiverSocketId = connectedUsers.get(updatedMessage.receiver);

        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageStatusUpdated', updatedMessage);
        }

        res.status(200).json({
            message: updatedMessage
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete a Message
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        const io = getIo();
        const connectedUsers = getConnectedUsers();
        
        const receiverSocketId = connectedUsers.get(deletedMessage.receiver);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageDeleted', deletedMessage);
        }
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: deletedMessage });
    } catch (error) {
        return res.status(500).json({ message: "message not deleted" });
    }
};

// Get All Messages
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ timestamp: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Messages Between Two Users
const getMessageBetweenUser = async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({ messages: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message } = req.body;
        const updatedMesage = await Message.findOne({ _id: messageId });
        if (!updatedMesage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        updatedMesage.message = message || updatedMesage.message;
        const io = getIo();
        const connectedUsers = getConnectedUsers();
        
        const receiverSocketId = connectedUsers.get(updatedMessage.receiver);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageUpdated', updatedMessage);
        }
        const updatedMessage = await updatedMesage.save();
        res.status(200).json({ message: 'Message updated successfully', updatedMessage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createMessage,
    deleteMessage,
    getAllMessages,
    getMessageBetweenUser,
    updateMessageStatus,
    updateMessage
};  
