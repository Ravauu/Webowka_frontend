import { defineStore } from 'pinia';
import adminService from '../services/adminService';

export const useAdminStore = defineStore('admin', {
    state: () => ({
        allOrders: [],
        allUsers: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchAllOrders() {
            this.loading = true;
            try {
                this.allOrders = await adminService.getAllOrders();
            } catch (error) {
                this.error = error.message || 'Nie udało się pobrać zamówień.';
            } finally {
                this.loading = false;
            }
        },

        async updateOrderStatus(orderId, status) {
            this.loading = true;
            try {
                await adminService.updateOrderStatus(orderId, status);
                const order = this.allOrders.find(order => order.id === orderId);
                if (order) order.status = status;
            } catch (error) {
                this.error = error.message || 'Nie udało się zaktualizować statusu zamówienia.';
            } finally {
                this.loading = false;
            }
        },

        async deleteOrder(orderId) {
            this.loading = true;
            try {
                await adminService.deleteOrder(orderId);
                this.allOrders = this.allOrders.filter(order => order.id !== orderId);
            } catch (error) {
                this.error = error.message || 'Nie udało się usunąć zamówienia.';
            } finally {
                this.loading = false;
            }
        },

        async fetchAllUsers() {
            this.loading = true;
            try {
                this.allUsers = await adminService.getAllUsers();
            } catch (error) {
                this.error = error.message || 'Nie udało się pobrać użytkowników.';
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(userId) {
            this.loading = true;
            try {
                await adminService.deleteUser(userId);
                this.allUsers = this.allUsers.filter(user => user.id !== userId);
            } catch (error) {
                this.error = error.message || 'Nie udało się usunąć użytkownika.';
            } finally {
                this.loading = false;
            }
        },
    },
});
