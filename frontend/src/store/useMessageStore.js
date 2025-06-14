import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { getSocket } from '../socket/socketclient';
import { useAuthStore } from './useAuthStore';



export const useMessageStore = create((set, get) => ({


    Messages: [],
    unreadCount: parseInt(localStorage.getItem('unreadCount')) || 0,
    socket: null,
    setSocket: (socket) => set({ socket }),
    activeMatchId: null,  // Track active match ID
    activeMatchName: null,  // Track active match ID
    setActiveMatchId: (id) => set({ activeMatchId: id }),
    setActiveMatchName: (name) => set({ activeMatchName: name }),
    onlineUsers: new Set(), // Store the online users' IDs


    setOnlineStatus: (userId, status) => set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        if (status === 'online') {
            onlineUsers.add(userId); // Add user to the online users set
        } else {
            onlineUsers.delete(userId); // Remove user from the online users set
        }
        return { onlineUsers };
    }),



    incrementUnreadCount: () => set(state => {
        const newCount = state.unreadCount + 1;
        localStorage.setItem('unreadCount', newCount); // Save unread count to local storage
        return { unreadCount: newCount };
    }),
    resetUnreadCount: () => {

        localStorage.setItem('unreadCount', 0); // Reset unread count in local storage
        set({ unreadCount: 0 });
    },
    createMessage: async (messageData) => {
        try {
            const socket = getSocket();

            const response = await axiosInstance.post('/message/create', messageData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { message } = response.data;
            set(state => ({
                Messages: [...state.Messages, message],
            }));
            socket.emit('sendMessage', message);

        } catch (error) {
            toast.error(error.message);
        }
    },
    getAllMessagesBetweenUser: async (senderId, receiverId) => {
        try {

            const response = await axiosInstance.get(`/message/${senderId}/${receiverId}`);
            set({ Messages: response.data.messages });

        } catch (error) {
            set({ Messages: [] });
            toast.error(error.message);
        }
    },

    updateMessageStatus: async (messageId, messageStatus) => {
        try {
            const response = await axiosInstance.put(`/message/status/${messageId}/${messageStatus}`);
            const updatedMessage = response.data.message;
            set((state) => ({
                Messages: state.Messages.map((message) =>
                    message._id === updatedMessage._id ? updatedMessage : message
                ),
            }));

        } catch (error) {
            toast.error(error.message);
        }
    },

    getNewMessage: () => {
        try {
            const socket = getSocket();

            const authUser = useAuthStore.getState().authUser;

            socket.on('userStatus', ({ userId, status }) => {
                // Update the online status of the user
                set((state) => {
                    const onlineUsers = new Set(state.onlineUsers);
                    if (status === 'online') {
                        onlineUsers.add(userId); // Add user to the online users set
                    } else {
                        onlineUsers.delete(userId); // Remove user from the online users set
                    }
                    return { onlineUsers };
                });
            });
            socket.on('newMessage', (message) => {
                const currentPath = window.location.pathname;
                const isChatOpen = currentPath.includes('/chat') && currentPath.includes(message.sender);
                if (!isChatOpen && message?.sender !== authUser?._id) {
                    // Increment unread count
                    get().incrementUnreadCount();

                }

                if (isChatOpen) {
                    get().resetUnreadCount();

                }


                if (message.messageStatus === 'sent') {
                    if (message.receiver === authUser._id) {
                        get().updateMessageStatus(message._id, 'delivered');
                    }
                }

                set((state) => {
                    const newMessage = [...state.Messages, message];
                    newMessage.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    return { Messages: newMessage };
                });
                toast.success("New message received,pls Check");
            });

            socket.on('messageStatusUpdated', (updatedMessage) => {
                set((state) => ({
                    Messages: state.Messages.map((message) =>
                        message._id === updatedMessage._id ? updatedMessage : message
                    ),
                }));
            });
        } catch (error) {

        }
    },
    unSubscribeFromNewMessage: () => {
        try {
            const socket = getSocket();
            socket.off('newMessage');
            socket.off('messageStatusUpdated');


        } catch (error) {
        }
    },
    updateMessage: async (messageId, message) => {
        try {
            const socket = getSocket();
            const response = await axiosInstance.put(`/message/${messageId}`,{ message},{
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const updatedMessage = response.data.message;
            set((state) => ({
                Messages: state.Messages.map((message) =>
                    message._id === updatedMessage._id ? updatedMessage : message
                ),
            }));
            socket.on('messageUpdated', (updatedMessage) => {
                set((state) => ({   
                    Messages: state.Messages.map((message) =>
                        message._id === updatedMessage._id ? updatedMessage : message
                    ),
                }));
            });
        } catch (error) {
            toast.error(error.message);
        }
    },
    deleteMessage: async (messageId) => {
        try {
            const socket = getSocket();
            const response = await axiosInstance.delete(`/message/${messageId}`);
            const deletedMessage = response.data.message;
            set((state) => ({
                Messages: state.Messages.filter((message) => message._id !== deletedMessage._id),
            }));
            socket.off('messageDeleted');
            socket.on('messageDeleted', (deletedMessage) => {
                set((state) => ({   
                    Messages: state.Messages.filter((message) => message._id !== deletedMessage._id),
                }));
            });
        } catch (error) {
            toast.error(error.message);
        }
    },
}),
    {
        name: 'message-storage',
        getStorage: () => localStorage,
    }


)