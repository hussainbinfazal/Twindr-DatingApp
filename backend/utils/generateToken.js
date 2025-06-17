const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
    try {
        console.log("generateToken called", "recievedUserID", userId.toString());
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return token;
    } catch (error) {
        throw new Error("Failed to generate token");

    }
};

module.exports = generateToken;