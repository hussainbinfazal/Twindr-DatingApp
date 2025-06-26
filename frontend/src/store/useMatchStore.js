import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { getSocket } from '../socket/socketclient';

export const useMatchStore = create((set) => ({

    matches: [],
    loading: false,
    matchBetween: null,
    getMyMatches: async () => {
        const token = localStorage.getItem("token");
        set({ loading: true });
        try {
            const response = await axiosInstance.get("/match/matches", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            set({ matches: response.data.matches });
            set({ loading: false });
        } catch (error) {
            set({ matches: [] });
            toast.error("Matches not fetched");

        }
    },
    unMatchProfile: async (userId) => {
        const token = localStorage.getItem("token");
        set({ loading: true });
        try {
            const response = await axiosInstance.post(`/match/swipe-left/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            set({ matches: response.data });
            toast.error("Profile unmatched")
            set({ loading: false });

        } catch (error) {
            toast.error("Profile not unmatched")
        }
    },
    createMatch: async (userId) => {
        set({ loading: true });
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.post(`/match/swipe-right/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            set({ matches: response.data.profile });
            toast.success("Match request send")
            set({ loading: false });

        } catch (error) {
            toast.error(" Internal server Error")
        }
    },
    deleteMatches: async (userId) => {
        set({ loading: true });
        const token = localStorage.getItem("token");
        try {
            const response = await axiosInstance.delete(`/match/match/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            set({ matches: response.data });
            toast.success("Match deleted successfully")
            set({ loading: false });

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