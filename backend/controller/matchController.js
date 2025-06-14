const Match = require("../model/matchModel");  // Replacing import with require
const Profile = require("../model/profileModel");  // Assuming Profile is also required
const User = require("../model/userModel");
const { getconnectedUsers, getIo } = require("../socket/socket.server");
// Match a Profile
const SwipeRight = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) return res.status(400).json({ message: "User not found" });
        const likedUserId = req.params.id;
        const likedUser = await User.findById(likedUserId);
        if (!likedUser) return res.status(400).json({ message: "User not found" });

        
        if (likedUser.dislikes.includes(currentUserId)) {
            return res.status(400).json({ message: "This user is already disliked" });

        }
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();
        }
        if (likedUser.likes.includes(currentUserId)) {
            if (!currentUser.matches.includes(likedUserId)) {
                currentUser.matches.push(likedUserId);
                await currentUser.save();
            }
            if (!likedUser.matches.includes(currentUserId)) {
                likedUser.matches.push(currentUserId);
                await likedUser.save();
            }
            
            const matchAccepted = await Match.create({
                currentUser: currentUserId,
                likedUser: likedUserId,
                status: "accepted"
            })
            await matchAccepted.save();
            // Send notification to both users //
            const connectedUsers = getconnectedUsers();
            const io = getIo();
            const likedUserSocketId = connectedUsers.get(likedUserId);
            if (likedUserSocketId) {
                io.to(likedUserSocketId).emit('match', {
                    _id: matchAccepted._id && currentUserId,
                    name: currentUser.name,
                    profilePicture: currentUser.profilePicture,
                });
            }
            const conectedUserSocketId = connectedUsers.get(currentUserId.toString());
            if (conectedUserSocketId) {
                io.to(conectedUserSocketId).emit('match', {
                    _id: matchAccepted._id && likedUserId,
                    name: likedUser.name,
                    profilePicture: likedUser.profilePicture,
                });
            }

            return res.status(200).json({
                message: "It is a match",
                match: matchAccepted
            })
        }
        res.status(201).json({ message: 'Waiting for the Match from the other side' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get All Matches for a User
const getMatches = async (req, res) => {
    try {

        const currentUserId = req.user.id;
        const currentUser = await User.findById(currentUserId).populate('matches');
        const profile = await Profile.findOne({ user: currentUserId }).populate('user');
        if (!currentUser) return res.status(400).json({ message: "User not found" });
        const populatedMatches = await Promise.all(
            currentUser.matches.map(async (match) => {
                const matchProfile = await Profile.findOne({ user: match._id }).populate('user');
                return { ...match.toObject(), profile: matchProfile };  // Attach the profile to the match
            })
        );
        return res.status(200).json({
            message: "All Matches",
            matches: populatedMatches,
            profile: profile
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete Match with another User //
const deleteMatchWithUser = async () => {
    let { curentUserId } = req.user.id;
    let likedUserId = req.params.id;
    let likedUser = User.findById(likedUserId);
    let currentUser = User.findById(curentUserId);
    if (currentUser.matches.includes(likedUserId)) {
        currentUser.matches = currentUser.matches.filter(match => match.toString() !== likedUserId.toString());
        await currentUser.save();
    }
    if (likedUser.matches.includes(curentUserId)) {
        likedUser.matches = likedUser.matches.filter(match => match.toString() !== curentUserId.toString());
        await likedUser.save();
    }
    res.status(200).json({ message: 'Match deleted successfully' });
}

// const matchbetweenUser = async (req,res) => {
//     const createdMatch = await Match.findById({senderId:req.params.id});
//     res.status(200).json(createdMatch);
// }
// Unmatch a Profile
const unmatchProfile = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const likedUserId = req.params.id;
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) return res.status(400).json({ message: "User not found" });
        const likedUser = await User.findById(likedUserId);
        if (!likedUser) return res.status(400).json({ message: "Liked User not found" });
        if (!currentUser.dislikes.includes(likedUserId)) {
            currentUser.dislikes.push(likedUserId);
            await currentUser.save();

        }
        return res.status(201).json({
            message: "user disliked",
            dislikedUser: currentUser.dislikes
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    SwipeRight,
    unmatchProfile,
    deleteMatchWithUser,
    getMatches,

};  // Exporting all functions using module.exports


