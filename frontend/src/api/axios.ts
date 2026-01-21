import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-dia11.onrender.com/api',
    withCredentials: true, // Esto permite el envío de cookies/tokens
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;