const express = require('express');  
const mongoose = require('mongoose');  
const cors = require('cors');  
const userRoutes = require('./routes/userRoutes');  
const dotenv = require('dotenv');  
const connectDB = require('./config/db');  
const profileRoutes = require('./routes/profileRoutes');  
const matchRoutes = require('./routes/matchRoutes');  
const messageRoutes = require('./routes/messageRoutes');  
const cookieParser = require('cookie-parser');  
const path = require('path');  
const { initializeSocket } = require('./socket/socket.server');

dotenv.config();



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
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS','PATCH'],  
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


if (process.env.NODE_ENV === 'production') {
    // Serve static files from the build folder
    app.use(express.static(path.join(__dirname, 'dist')));
    
    // Handle React routing - send all non-API requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/message', messageRoutes);



httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

