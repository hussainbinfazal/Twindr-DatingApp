const jwt = require('jsonwebtoken');  // Replacing import with require

exports.generateToken = (userId, res) => {
    try {
        console.log("generateToken called", "recievedUserID", userId.toString());
        const token = jwt.sign({ id: userId}, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // Token expiration (30 days)
        });
        return token;
    } catch (error) {
        console.error("Error in generateToken:", error);
        throw new Error("Failed to generate token");
    
    }
};
