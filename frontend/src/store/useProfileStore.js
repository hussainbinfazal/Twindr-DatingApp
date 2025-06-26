import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'


export const useProfileStore = create((set, get) => ({
    profiles: [],
    matchProfile: {},
    loading: false,

    getAllProfiles: async () => {
        set({ loading: true })
        const token = localStorage.getItem("token");
        
        try {
            const response = await axiosInstance.get('/profile/profiles', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            set({ profiles: response.data })
            const data = response
            set({ loading: false })
            return data
        } catch (error) {
            set({ profiles: [] })
            // toast.error(error.message)
        }
    },
    getSingleProfile: async (profileId) => {
        set({ loading: true })
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.get(`/profile/${profileId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            set({ matchProfile: response.data.profile })
            const data = response
            return data
        } catch (error) {
            set({ matchProfile: {} })
            // toast.error(error.message)
        }
    }
}))