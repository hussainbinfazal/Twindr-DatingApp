const User = require('../model/userModel');  
const Profile = require('../model/profileModel');
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const generateToken = require('../utils/generateToken');
// Create User
const createUser = async (req, res) => {
    try {
        const { name, email, password, gender, age, genderPreferences } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashpassword, gender, age, genderPreferences, });
        await user.save();
        const token =  generateToken(user._id, res);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user:user,
            token:token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User By ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }
        const { name, email, password, gender, age, genderPreferences } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Use Authentication Token
const useAuthenticationToken = async (req, res, next) => {
   
    try {
        const user = await User.findById(req.user.id || req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User is authenticated', user: user });
    } catch (error) {
        // console.error("Error in authentication:", error);
        return res.status(401).json({ message: 'Unauthorized, Please Login first' });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Username or Password is invalid' });
        }
        const token = generateToken(user._id, res);
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user:user,
            token: token
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
   
    useAuthenticationToken, 
    loginUser, 
    logoutUser 
};  // Exporting all functions using module.exports
