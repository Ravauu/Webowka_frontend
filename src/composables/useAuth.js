import {computed} from 'vue';
import {useAuthStore} from '@/stores/authStore.js';

export function useAuth() {
    const authStore = useAuthStore();

    const login = async (credentials) => {
        try {
            // Zwracamy dane z logowania
            return await authStore.login(credentials);
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
        try{
            return await authStore.register(userData);
        }  catch(error) {
            throw new Error('Register failed');
        }
    };

    const logout = () => {
        authStore.logout();
    };

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    return {
        login,
        register,
        updateUser,
        logout,
        isAuthenticated
    };
}