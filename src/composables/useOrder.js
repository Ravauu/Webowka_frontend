import { useOrderStore } from '@/stores/orderStore';
import {computed} from "vue";

export const useOrder = () => {
    const orderStore = useOrderStore();

    const fetchOrders = async () => {
        await orderStore.fetchOrders();
    };

    const fetchOrder = async (orderId) => {
        await orderStore.fetchOrder(orderId);
    };

    const fetchUserOrders = async () => {
        await orderStore.fetchUserOrders();
    };

    const createOrder = async (orderData) => {
        await orderStore.createOrder(orderData);
    };

    const updateOrderStatus = async (orderId, status) => {
        await orderStore.updateOrderStatus(orderId, status);
    };

    const deleteOrder = async (orderId) => {
        await orderStore.deleteOrder(orderId);
    };

    return {
        orders: orderStore.orders,
        userOrders: orderStore.userOrders,
        currentOrder: computed(() => orderStore.currentOrder),
        loading: orderStore.loading,
        error: orderStore.error,
        fetchOrders,
        fetchOrder,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        fetchUserOrders,
    };
};
