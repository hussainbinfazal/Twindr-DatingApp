import { create } from 'zustand';
import Login from '../components/Login.jsx';
import axios from 'axios';
import { axiosInstance } from '../lib/axios.js';
import Register from '../components/Register.jsx';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { initializeSocket, disconnectSocket } from '../socket/socketclient.js'; // Corrected import statement




export const useAuthStore = create((set) => ({

    authUser: null,
    authUserProfile: null,
    checkingAuth: true,


    deleteProfile: async (profileId) => {
        try {
            const response = await axiosInstance.delete(`/profile/${profileId}`)
            set({ authUserProfile: null }); // Clear the authUserProfile(null);
            toast.success(response.data.message);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);


        }
    },
    fetchProfile: async (userId) => {
        try {
            const response = await axiosInstance.get(`/profile/user/${userId}`);
            const { profile } = response.data;
            set({ authUserProfile: profile });

            // set({ authUser: response.data });
        } catch (error) {

        }
    },
    updateProfile: async (profileData, userId) => {
        try {
            const response = await axiosInstance.put(`profile/${userId}`, profileData ,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    

            const { profile } = response.data;
            set({ authUserProfile: profile });
            toast.success(response.data.message);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        }
    },
    createProfile: async (profileData) => {
        try {
            const response = await axiosInstance.post('/profile/create', profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            });
            const { profile } = response.data;
            set({ authUserProfile: profile });
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Something went wrong");
            toast.error("Please try again after sometimes");
        }
    },
    logoutUser: async (navigate) => {
        try {
            const response = await axiosInstance.post('/users/logout',);
            set({ authUser: null });
            set({ authUserProfile: null });
            disconnectSocket();
            localStorage.removeItem("token");
            navigate('/login');
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message
                ? error.response.data.message
                : error.message
                    ? error.message
                    : "Something went wrong"
            );
        }
    },

    loginUser: async (loginData, navigate) => {
        try {
            const response = await axiosInstance.post('/users/login', loginData);
            const { token, user } = response.data;
            set({ authUser: user });
            localStorage.setItem('token', token);
            initializeSocket(user._id);
            navigate('/Home');
            toast.success('login Successfull');
        } catch (error) {
            toast.error(error.response.data.message
                ? error.response.data.message
                : error.message
                    ? error.message
                    : "Something went wrong"
            );
        }
    },

    registerUser: async (signupData, navigate) => {
        try {
            const response = await axiosInstance.post('/users/register', signupData);
            const { token, user } = response.data;
            set({ authUser: user });
            initializeSocket(user._id)
            localStorage.setItem("token", token);
            navigate('/Home');
            toast.success('User Registered Successfully');
        } catch (error) {
            toast.error(error.response.data.message
                ? error.response.data.message
                : error.message
                    ? error.message
                    : "Something went wrong"
            );
        }
    },



    checkAuth: async () => {
        const token = localStorage.getItem("token");
        // if (token) {
            if (!token) {
                // console.error("You are not logged in.");
            }
        try {
            const response = await axiosInstance.get('/users/me', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            set({ authUser: response.data.user, checkingAuth: false });
            

        } catch (error) {
            set({ checkingAuth: false, authUser: null });
            
        }
       
    }

}));

