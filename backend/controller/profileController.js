const Profile = require("../model/profileModel");  // Replacing import with require
const upload = require("../multer/multer");  // Replacing import with require
const fs = require('fs').promises;  // Replacing import with require
const mongoose = require("mongoose");  // Replacing import with require
const path = require('path');
const User = require("../model/userModel");
// Create Profile
const createProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is not Uploaded" });
        }

        const profilePicture = req.file ? `/uploads/profile-pictures/${req.file.filename}` : null;
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile Picture is not Uploaded" });

        }
        const { name, age, email, gender, bio, genderPreferences, interests, education, occupation } = req.body;

        let profile = await Profile.findOne({ email });
        if (profile) {
            return res.status(404).json({
                profile,
                message: 'Profile already exists'
            });
        }
        profile = await Profile.create({
            name, age, email, gender, genderPreferences, interests, education, occupation, bio, user: req.user.id, profilePicture
        });
        await profile.save();
        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            profile
        });

        // });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile by User ID
const getProfileByUserId = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile by from al the users //
const getProfiles = async (req, res) => {
    try {
        // Get current user with matches and unmatches populated
        const currentUser = await User.findById(req.user.id).populate('matches').populate('unmatches').populate('dislikes').populate('likes');

        const currentUserProfile = await Profile.findOne({ user: currentUser.id }).populate('user');

        // Get the IDs of matched and unmatched users
        const matchedIds = currentUser.matches.map(match => match._id);
        const unmatchedIds = currentUser.unmatches.map(unmatch => unmatch._id);
        const likedIds = currentUser.likes.map(like => like._id);
        const dislikedIds = currentUser.dislikes.map(dislike => dislike._id);
        // Find profiles excluding current user, matches, and unmatches

        const userProfiles = await Profile.find({
            $and: [
                { user: { $ne: currentUser.id } },           // Exclude current user
                { user: { $nin: likedIds } },           // Exclude current user
                { user: { $nin: matchedIds } },           // Exclude matched users
                { user: { $nin: unmatchedIds } },
                { user: { $nin: dislikedIds } },
                {
                    gender: currentUserProfile.genderPreferences === "Both" ? { $in: ["Male", "Female"] } : currentUserProfile.genderPreferences,
                },
                { genderPreferences: { $in: [currentUserProfile.gender, "Both"] } }
                // Exclude unmatched users
            ]
        });

        res.status(200).json({ profiles: userProfiles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        let profilePicture = null;
        if (req.file) {
            profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        }
        // const profilePicture = req.file ? `/uploads/profile-pictures/${req.file.filename}` : null;
        const { name, age, email, gender, genderPreferences, bio, interests, education, occupation } = req.body;
        const profile = await Profile.findOne({ user: req.params.id });

        if (req.file && profile.profilePicture) {
            const oldImagePath = path.join(__dirname, '../uploads/profile-pictures', path.basename(profile.profilePicture));
            try {
                await fs.unlink(oldImagePath);
            } catch (err) {
                // Continue with the update even if old image deletion fails
            }
        }

        if (profilePicture) {
            profile.profilePicture = profilePicture;
        }




        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if (profile.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this profile' });
        }
        profile.name = name || profile.name;
        profile.age = age || profile.age;
        profile.gender = gender || profile.gender;
        profile.email = email || profile.email;
        profile.bio = bio || profile.bio;
        profile.genderPreferences = genderPreferences || profile.genderPreferences;
        profile.interests = interests || profile.interests;
        profile.education = education || profile.education;
        profile.occupation = occupation || profile.occupation;
        profile.profilePicture = profilePicture || profile.profilePicture;
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Profile
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        if (profile.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this profile' });
        }
        if (profile.profilePicture) {

            const imagePath = path.join(__dirname, '../uploads/profile-pictures', path.basename(profile.profilePicture));
            try {
                await fs.unlink(imagePath);  // Delete the image asynchronously
                profile.profilePicture = null;

            } catch (err) {
                console.error('Error deleting the image:', err);
                return res.status(500).json({ message: 'Error deleting the image' });
            }
        }
        await Profile.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get My Profile
const myProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Profile Authenticated Successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProfileById = async (req, res) => {
    try {
        const { profileId } = req.params;
        if(!profileId){
            return res.status(404).json({ message: "userId not found" });
        };
        const profile = await Profile.findOne({ user: profileId});
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        };
        res.status(200).json({ profile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createProfile,
    getProfileByUserId,
    getProfiles,
    updateProfile,
    deleteProfile,
    myProfile,
    getProfileById
};  // Exporting all functions using module.exports
