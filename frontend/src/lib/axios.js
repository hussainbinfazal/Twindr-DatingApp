import React from 'react'
import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AXIOS_URL ? import.meta.env.VITE_AXIOS_URL : 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});



