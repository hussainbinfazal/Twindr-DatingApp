const express = require('express');  // Replacing import with require
const mongoose = require('mongoose');  // Replacing import with require
const cors = require('cors');  // Replacing import with require
const userRoutes = require('./routes/userRoutes');  // Replacing import with require
const dotenv = require('dotenv');  // Replacing import with require
const connectDB = require('./config/db');  // Replacing import with require
const profileRoutes = require('./routes/profileRoutes');  // Replacing import with require
const matchRoutes = require('./routes/matchRoutes');  // Replacing import with require
const messageRoutes = require('./routes/messageRoutes');  // Replacing import with require
const cookieParser = require('cookie-parser');  // Replacing import with require
// const socketIo = require('socket.io');
const path = require('path');  // Replacing import with require
const { initializeSocket } = require('./socket/socket.server');

dotenv.config();

// io.on('connection',(socket)=>{
//     console.log("A user connected",socket.id);
//     socket.on('disconnect',()=>{
//         console.log("A user disconnected", socket.id);
//     })
// })

const app = express();
const httpServer = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
initializeSocket(httpServer);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // You can customize the methods allowed
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/message', messageRoutes);



httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
// });
