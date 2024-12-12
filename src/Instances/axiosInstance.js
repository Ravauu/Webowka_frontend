import axios from 'axios';
import AuthService from '../services/authService.js';  // Import samego AuthService, aby obsłużyć logout

const BASE_URL = import.meta.env.VITE_API_URL;

// Tworzymy instancję Axios
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        console.log('[DEBUG] Axios Request:', config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor dla obsługi błędów
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const { data } = await AuthService.refresh(refreshToken);
                    localStorage.setItem('access_token', data.access_token);
                    originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Token refresh failed', refreshError);
                    await AuthService.logout();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;