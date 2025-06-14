    import { io } from 'socket.io-client';

const SOCKET_URl = "http://localhost:5000"; // Connect to the backend server


let socket = null;

export const initializeSocket = (userId) => {
  if (socket) {
    socket.disconnect()
  }
  socket = io(SOCKET_URl, {
    auth: { userId }
  });


// socket.on('disconnect', () => {
// });

// socket.on('message', (data) => {
// });

// socket.on('receiveMessage', (data) => {
// });
// socket.on('newMessage', (data) => { 
// });


}

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket is not initialized');
  }
  return socket;
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit('sendMessage', messageData);
  } else {
  }
};