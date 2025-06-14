const mongoose = require('mongoose');  // Replacing import with require

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        matches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        unmatches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;  // Replacing export default with module.exports
