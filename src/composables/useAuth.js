import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';

export function useAuth() {
    const authStore = useAuthStore();

    const login = async (credentials) => {
        try {
            return await authStore.login(credentials);
        } catch (error) {
            throw new Error('Login failed');
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

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    // Sprawdzanie, czy użytkownik ma rolę admina
    const isAdmin = computed(() => {
        console.log('Current user roles:', authStore.user?.roles); // Loguje role użytkownika
        if (authStore.user && authStore.user.roles) {
            return authStore.user.roles.includes('admin');
        }
        return false;
    });

    const currentUser = computed(() => authStore.user);

    return {
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        currentUser,
    };
}
