const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
    console.log("Domain:", process.env.JWT_DOMAIN);
    try {
        console.log("generateToken called", "recievedUserID", userId.toString());
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : "",
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax', maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            domain: process.env.NODE_ENV === 'production' ? process.env.JWT_DOMAIN : undefined

        });
        return token;
    } catch (error) {
        throw new Error("Failed to generate token");

    }
};

module.exports = generateToken;