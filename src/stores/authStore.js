import { defineStore } from 'pinia';
import AuthService from '../services/authService.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,  // Na razie user jest null, bo nie pobieramy go z backendu
        accessToken: localStorage.getItem('access_token') || null,
        refreshToken: localStorage.getItem('refresh_token') || null,
        isAuthenticated: !!localStorage.getItem('access_token'), // Sprawdzamy, czy użytkownik jest zalogowany na podstawie tokenu
    }),

    actions: {
        // Logowanie użytkownika
        async login(credentials) {
            try {
                const response = await AuthService.login(credentials);

                console.log("Login Response:", response.data);

                // Jeśli odpowiedź zawiera access_token, zapisujemy go i refresh_token
                if (response.data && response.data.access_token) {
                    this.accessToken = response.data.access_token;
                    this.refreshToken = response.data.refresh_token;

                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);

                    this.isAuthenticated = true;

                    // Nie oczekujemy użytkownika, więc pomijamy zapisanie usera
                    return response.data;  // Zwracamy dane (np. tokeny) z backendu
                } else {
                    console.error('Login failed: Invalid response data');
                    throw new Error('Invalid response data');
                }
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },

        // Odświeżenie tokenu
        async refreshToken() {
            try {
                const response = await AuthService.refresh();
                if (response && response.data) {
                    localStorage.setItem('access_token', response.data.access_token || '');
                    this.accessToken = response.data.access_token || '';
                }
            } catch (error) {
                console.error('Refresh token failed:', error);
                this.logout();  // Wylogowanie użytkownika po nieudanej próbie odświeżenia tokenu
                throw error;
            }
        },

        // Wylogowanie użytkownika
        logout() {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            this.accessToken = null;
            this.refreshToken = null;
            this.user = null;
            this.isAuthenticated = false;
        },

        // Funkcja do sprawdzania stanu autoryzacji użytkownika
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
        // Zwraca, czy użytkownik jest zalogowany
        isUserAuthenticated: (state) => state.isAuthenticated,

        // Zwraca dane użytkownika (na razie jest null, bo nie pobieramy usera z backendu)
        currentUser: (state) => state.user,
    },
});
