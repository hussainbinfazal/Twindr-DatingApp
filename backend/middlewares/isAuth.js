const jwt = require('jsonwebtoken');  
const User = require('../model/userModel');  

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null') {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        console.log("isAuthenticated middleware called", "token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        req.user = user;
        next();
    } catch (error) {
        // console.log("Error in isAuthenticated middleware:", error);
        console.error("isAuthentication error:", error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = isAuthenticated;  // Exporting the middleware using module.exports
