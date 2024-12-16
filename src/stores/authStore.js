import { defineStore } from 'pinia';
import AuthService from '../services/authService.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
        isAuthenticated: !!localStorage.getItem('access_token'),
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await AuthService.login(credentials);

                if (response.data && response.data.access_token) {
                    this.accessToken = response.data.access_token;
                    this.refreshToken = response.data.refresh_token;
                    this.user = response.data.user;

                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    this.isAuthenticated = true;
                    return response.data;
                } else {
                    console.error('Login failed: Invalid response data');
                    throw new Error('Invalid response data');
                }
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        async register(userData) {
            try {
                const response = await AuthService.register(userData);
                console.log('[DEBUG] Register Response:', response.data);
                return response.data;
            } catch (error) {
                console.error('[DEBUG] Register Error:', error.response?.data || error.message);
                throw error; // Przekazanie błędu do `useAuth`
            }
        },

        async refreshToken() {
            try {
                const response = await AuthService.refresh();
                if (response && response.data) {
                    this.accessToken = response.data.access_token;
                    localStorage.setItem('access_token', response.data.access_token);
                }
            } catch (error) {
                console.error('Refresh token failed:', error);
                this.logout();
                throw error;
            }
        },

        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            this.accessToken = null;
            this.refreshToken = null;
            this.user = null;
            this.isAuthenticated = false;
        },

        checkAuth() {
            const accessToken = localStorage.getItem('access_token');
            const user = localStorage.getItem('user');
            if (accessToken && user) {
                this.accessToken = accessToken;
                this.user = JSON.parse(user);
                this.isAuthenticated = true;
            } else {
                this.isAuthenticated = false;
            }
        },
    },

    getters: {
        isAdmin: (state) => state.user?.roles?.includes('admin'),
    },
});