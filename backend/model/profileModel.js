const mongoose = require('mongoose');  // Replacing import with require
const User = require('./userModel');   // Replacing import with require

const profileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        profilePicture: { type: String, required: true },
        bio: { type: String, required: true },
        genderPreferences: {
            type: String,
            enum: ['male', 'female']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        interests: [
            {
                type: String,
                required: true
            }
        ],
        education: {
            type: String,
            required: true
        },
        occupation: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;  // Replacing export default with module.exports
