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

                console.log('Login Response:', response);  // Logujemy pełną odpowiedź

                return response.data;

            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },

        async updateUser(userData) {
            try {
                const response = await AuthService.updateUser(userData);
                console.log('Update User Response:', response.data);
                if (response && response.data) {
                    this.user = { ...this.user, ...response.data }; // Aktualizacja lokalnych danych użytkownika
                }
                return response.data;
            } catch (error) {
                console.error('Update user failed:', error);
                throw error;
            }
        },

        async register(userData) {
            try{
                const response = await AuthService.register(userData);
                console.log('Register Response:', response.data);
                return response.data;
            } catch (error) {
                console.error('[DEBUG] Register Error:', error);
                throw error;
            }
        },

        // Odświeżenie tokenu dostępu
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

        // Wylogowanie użytkownika (czyszczenie tokenów)
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
