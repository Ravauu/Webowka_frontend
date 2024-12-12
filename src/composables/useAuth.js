import {computed} from 'vue';
import {useAuthStore} from '@/stores/authStore.js';

export function useAuth() {
    const authStore = useAuthStore();

    const login = async (credentials) => {
        try {
            return await authStore.login(credentials); // Zwraca dane logowania
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const updateUser = async (userData) => {
        try {
            return await authStore.updateUser(userData);
        } catch (error) {
            throw new Error('Update failed');
        }
    };

    const register = async (userData) => {
        try {
            return await authStore.register(userData);
        } catch (error) {
            throw new Error('Register failed');
        }
    };

    const logout = () => {
        authStore.logout();
    };

    // Zmienna do sprawdzania, czy użytkownik jest zalogowany
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const currentUser = computed(() => authStore.user);

    return {
        login,
        register,
        updateUser,
        logout,
        isAuthenticated,
        currentUser
    };
}
