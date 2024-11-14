import axiosInstance from '../Instances/axiosInstance.js';  // Używamy axiosInstance z interceptorami

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

    // register func
    register: (userData) => {
        console.log('[DEBUG] Registering with user data:', userData);

        return axiosInstance.post(`${BASE_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Register Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Register Error:', error);
            throw error;
        });
    },

    // Odświeżanie tokenu
    refresh: (refreshToken) => {
        console.log('[DEBUG] Refreshing token with:', refreshToken);

        return axiosInstance.get(`${BASE_URL}/refresh`, {
            params: { token: refreshToken },  // Dodajemy token w query params
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Token Refresh Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Token Refresh Error:', error);
            throw error;
        });
    },

    //update user stats
    updateUser: (userData) => {
        console.log('[DEBUG] Updating user profile with data:', userData);
        const accessToken = localStorage.getItem('access_token');

        return axiosInstance.put(`${BASE_URL}/user/update`, userData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Update User Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Update User Error:', error);
            throw error;
        });
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

    // Zmiana hasła użytkownika
    changePassword: (oldPassword, newPassword) => {
        console.log('[DEBUG] Changing password');
        const accessToken = localStorage.getItem('access_token');

        return axiosInstance.post(`${BASE_URL}/user/initiate-password-change`, { old_password: oldPassword, new_password: newPassword }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Change Password Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Change Password Error:', error);
            throw error;
        });
    },

    // Usunięcie konta
    deleteUser: (password) => {
        console.log('[DEBUG] Deleting user');
        const accessToken = localStorage.getItem('access_token');

        return axiosInstance.delete(`${BASE_URL}/user/delete`, {
            data: { password },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Delete User Response:', response.data);
            return response;
        }).catch(error => {
            console.error('[DEBUG] Delete User Error:', error);
            throw error;
        });
    },
};

export default AuthService;
