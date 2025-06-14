import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'


export const useProfileStore = create ((set,get) => ({
    profiles:[],
    matchProfile:{},

    getAllProfiles: async () => {
        try {
            const response = await axiosInstance.get('/profile/profiles');
            set({profiles: response.data})
        } catch (error) {
            set({profiles: []})
            // toast.error(error.message)
        }
    },
    getSingleProfile: async (profileId) => {
        try {
            const response = await axiosInstance.get(`/profile/${profileId}`);
            set({matchProfile: response.data.profile})
            const data = response
            return data
        } catch (error) {
            set({matchProfile: {}})
            // toast.error(error.message)
        }
    }
}))