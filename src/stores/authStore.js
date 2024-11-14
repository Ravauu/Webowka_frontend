import { defineStore } from 'pinia';
import AuthService from '../services/authServices.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
    }),

    actions: {
        // Logowanie użytkownika
        async login(credentials) {
            try {
                const response = await AuthService.login(credentials);

                // Zapisywanie tokenów do stanu aplikacji i do localStorage
                this.accessToken = response.data.access_token;
                this.refreshToken = response.data.refresh_token;

                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);

                console.log('Login successful:', response.data);
                return response.data;

            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },

        // Inne akcje, jak updateUser, register, refreshToken, logout
        async refreshToken() {
            try {
                const response = await AuthService.refresh();
                if (response && response.data) {
                    localStorage.setItem('access_token', response.data.access_token || '');
                    this.accessToken = response.data.access_token || '';
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
            this.accessToken = null;
            this.refreshToken = null;
            this.user = null;
        },
    },

    getters: {
        // Sprawdzenie, czy użytkownik jest zalogowany
        isAuthenticated: (state) => !!state.accessToken
    },
});
