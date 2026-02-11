import axios from 'axios';
import { BASENAME } from '@/constants';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // Adjust if backend port differs
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for auth token if available 
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
