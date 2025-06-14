import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { getSocket } from '../socket/socketclient';

export const useMatchStore = create((set) => ({

    matches: [],
    matchBetween: null,
    getMyMatches: async () => {
        try {
            const response = await axiosInstance.get("/match/matches");
            set({ matches: response.data.matches});
        } catch (error) {
            set({ matches: []});
            toast.error("Matches not fetched");

        }
    },
    unMatchProfile: async (userId) => {
        try {
            const response = await axiosInstance.post(`/match/swipe-left/${userId}`)
            set({ matches: response.data });
            toast.error("Profile unmatched")
        } catch (error) {
            toast.error("Profile not unmatched")
        }
    },
    createMatch: async (userId) => {
        try {
            const response = await axiosInstance.post(`/match/swipe-right/${userId}`)
            set({ matches: response.data.profile });
            toast.success("Match request send")
        } catch (error) {
            toast.error(" Internal server Error")
        }
    },
    deleteMatches: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/match/match/${userId}`)
            set({ matches: response.data });
            toast.success("Match deleted successfully")
        } catch (error) {
            toast.error("Match is not deleted")
        }
    },

    subscribeToNewMatches: () => {
        try {
            const socket = getSocket();
            socket.on('newMatch', (newMatch) => {
                set((state) => ({
                    matches: [...state.matches, newMatch],
                }));
                toast.success("You got a new match");
            });
        } catch (error) {

        }
    },
    unSubscribeFromNewMatches: () => {
        try {
            const socket = getSocket();
            socket.off('newMatch');

        } catch (error) {
        }
    }

}))