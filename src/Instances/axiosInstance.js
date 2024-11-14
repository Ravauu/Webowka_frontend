import axios from 'axios';
import AuthService from '../services/authServices.js';  // Import samego AuthService, aby obsłużyć logout

const BASE_URL = import.meta.env.VITE_API_URL;

// Tworzymy instancję Axios
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Interceptor dla obsługi błędów
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('[DEBUG] Axios Response:', response);  // Dodajemy logi dla odpowiedzi
        return response;  // Zwracamy odpowiedź, jeśli jest OK
    },
    async (error) => {
        console.error('[DEBUG] Axios Error:', error);  // Logowanie błędu
        const originalRequest = error.config;  // Zapisujemy oryginalne żądanie
        console.log('[DEBUG] Original Request:', originalRequest);

        // Sprawdzamy, czy błąd to 401 lub 403 (błąd autoryzacji)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('[DEBUG] Token expired or unauthorized, trying to refresh token...');
            try {
                // Próba odświeżenia tokena
                const refreshToken = localStorage.getItem('refresh_token');
                console.log('[DEBUG] Refresh Token:', refreshToken);

                if (!refreshToken) {
                    console.error('[DEBUG] No refresh token found. Logging out.');
                    throw new Error('No refresh token found');
                }

                // Używamy refresh tokena jako parametru query
                console.log('[DEBUG] Refreshing token...');
                const refreshResponse = await AuthService.refresh(refreshToken);
                console.log('[DEBUG] Refresh Response:', refreshResponse);

                if (refreshResponse && refreshResponse.data) {
                    console.log('[DEBUG] New Access Token:', refreshResponse.data.access_token);

                    // Zapisujemy nowy token w localStorage
                    localStorage.setItem('access_token', refreshResponse.data.access_token);
                    originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;

                    // Ponowienie pierwotnego żądania z nowym tokenem
                    console.log('[DEBUG] Retrying original request with new token...');
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('[DEBUG] Token refresh failed:', refreshError);
                // Jeśli odświeżenie tokena się nie powiedzie, wyloguj użytkownika
                console.log('[DEBUG] Logging out user...');
                AuthService.logout();
                window.location.href = '/login';  // Przekierowanie na stronę logowania
            }
        }

        // Jeśli nie był to błąd 401/403, lub odświeżenie się nie udało, zwróć błąd
        console.error('[DEBUG] Request failed:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;