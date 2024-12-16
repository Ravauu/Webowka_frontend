import axiosInstance from '../Instances/axiosInstance.js'; // Używamy axiosInstance z interceptorami

const BASE_URL = import.meta.env.VITE_API_URL;

const AuthService = {
    // Obsługa logowania
    login: (credentials) => {
        console.log('[DEBUG] Logging in with credentials:', credentials);

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', credentials.username);
        params.append('password', credentials.password);

        return axiosInstance.post(`${BASE_URL}/login`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => {
            console.log('[DEBUG] Login Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Login Error:', error);
            throw error;
        });
    },

    // Rejestracja nowego użytkownika
    register: (userData) => {
        console.log('[DEBUG] Registering with user data:', userData);

        return axiosInstance.post(`${BASE_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('[DEBUG] Register Response:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('[DEBUG] Register Error:', error.response?.data || error.message);
                throw error;
            });
    },

    // Odświeżanie tokenu
    refresh: (refreshToken) => {
        return axiosInstance.post(`${BASE_URL}/refresh`, { refresh_token: refreshToken });
    },

    // Wylogowanie
    logout: () => {
        console.log('[DEBUG] Logging out');
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.error('[DEBUG] No access token found for logout');
            throw new Error('No access token found');
        }

        return axiosInstance.post(`${BASE_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(response => {
            console.log('[DEBUG] Logout Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Logout Error:', error);
            throw error;
        });
    },
};

export default AuthService;
