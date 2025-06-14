const { Server } = require('socket.io');
// const http = require('http');
const Message = require('../model/messageModel')

let io;
const connectedUsers = new Map();

const initializeSocket = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error('invalid userId'));
        }
        socket.userId = userId;
        next();
    });

    io.on('connection', (socket) => {
        connectedUsers.set(socket.userId, socket.id);
        console.log('A user connected: ', socket.id);
        io.emit('userStatus', { userId: socket.userId, status: 'online' });
        // Listen for "sendMessage" event from client
        socket.on('sendMessage', async (messageData) => {
            try {
                const { sender, receiver, message } = messageData;

                // Emit the new message to both the sender and receiver (real-time update)
                io.to(receiver).emit('receiveMessage', messageData); // Send message to receiver
                io.to(sender).emit('receiveMessage', messageData); // Send message to sender

            } catch (error) {
                console.error('Error while sending message:', error);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            io.emit('userStatus', { userId: socket.userId, status: 'offline' })
            connectedUsers.delete(socket.userId, socket.id);
        });
    });
}


const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};


const getConnectedUsers = () => connectedUsers;

module.exports = { initializeSocket, getIo, getConnectedUsers };



