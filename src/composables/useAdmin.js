import { useAdminStore } from '@/stores/adminStore';
import { computed } from 'vue';

export const useAdmin = () => {
    const adminStore = useAdminStore();

    const fetchAllOrders = async () => {
        await adminStore.fetchAllOrders();
    };

    const updateOrderStatus = async (orderId, status) => {
        await adminStore.updateOrderStatus(orderId, status);
    };

    const deleteOrder = async (orderId) => {
        await adminStore.deleteOrder(orderId);
    };

    const fetchAllUsers = async () => {
        await adminStore.fetchAllUsers();
    };

    const deleteUser = async (userId) => {
        await adminStore.deleteUser(userId);
    };

    return {
        allOrders: computed(() => adminStore.allOrders),
        allUsers: computed(() => adminStore.allUsers),
        loading: computed(() => adminStore.loading),
        error: computed(() => adminStore.error),
        fetchAllOrders,
        updateOrderStatus,
        deleteOrder,
        fetchAllUsers,
        deleteUser,
    };
};
