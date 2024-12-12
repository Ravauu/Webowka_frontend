import { defineStore } from 'pinia';
import orderService from '../services/orderService';

export const useOrderStore = defineStore('order', {
    state: () => ({
        orders: [],
        userOrders: [], // Zamówienia użytkownika
        currentOrder: null, // Szczegóły aktualnego zamówienia
        loading: false,
        error: null,
        shouldRefreshOrders: false, // Flaga wymuszająca odświeżenie zamówień
    }),

    actions: {
        async fetchOrders() {
            this.loading = true;
            this.error = null;
            try {
                this.orders = await orderService.getOrders();
            } catch (error) {
                this.error = error.message || 'Nie udało się pobrać zamówień.';
            } finally {
                this.loading = false;
            }
        },

        async fetchUserOrders() {
            this.loading = true;
            this.error = null;
            try {
                const orders = await orderService.getUserOrders();
                console.log('Fetched orders from API:', orders);
                this.userOrders = orders; // Przypisanie reaktywne
            } catch (error) {
                console.error('Error in fetchUserOrders:', error);
                this.error = error.message || 'Nie udało się pobrać zamówień użytkownika.';
            } finally {
                this.loading = false;
            }
        },

        async fetchOrder(orderId) {
            this.loading = true;
            this.error = null;
            try {
                console.log('Fetching order:', orderId);
                const order = await orderService.getOrder(orderId);
                console.log('Fetched order data:', order);
                this.currentOrder = order;
            } catch (error) {
                console.error('Error fetching order:', error);
                this.error = error.message || 'Nie udało się pobrać szczegółów zamówienia.';
            } finally {
                this.loading = false;
            }
        },

        async createOrder(orderData) {
            this.loading = true;
            this.error = null;
            try {
                const newOrder = await orderService.createOrder(orderData);
                this.orders.push(newOrder);
                this.shouldRefreshOrders = true; // Ustaw flagę, aby wymusić odświeżenie
                return newOrder;
            } catch (error) {
                this.error = error.message || 'Nie udało się utworzyć zamówienia.';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateOrderStatus(orderId, status) {
            this.loading = true;
            this.error = null;
            try {
                const updatedOrder = await orderService.updateOrderStatus(orderId, status);
                const index = this.orders.findIndex((order) => order.id === orderId);
                if (index !== -1) {
                    this.orders[index].status = status;
                }
                return updatedOrder;
            } catch (error) {
                this.error = error.message || 'Nie udało się zaktualizować statusu zamówienia.';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteOrder(orderId) {
            this.loading = true;
            this.error = null;
            try {
                await orderService.deleteOrder(orderId); // Backendowa logika
                // Usuń z listy `orders` i `userOrders`
                this.userOrders = this.userOrders.filter((order) => order.id !== orderId);
                this.orders = this.orders.filter((order) => order.id !== orderId);
                // Wymuś odświeżenie widoku
                this.shouldRefreshOrders = true;
                localStorage.setItem('order-store', JSON.stringify({ ...this.$state })); // Ręczna synchronizacja stanu
            } catch (error) {
                this.error = error.message || 'Nie udało się usunąć zamówienia.';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        resetShouldRefreshOrders() {
            this.shouldRefreshOrders = false; // Reset flagi po odświeżeniu
        },
    },

    // Konfiguracja persystencji
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'order-store', // Klucz w localStorage/sessionStorage
                storage: localStorage, // Możesz zmienić na sessionStorage, jeśli wymagane
                paths: ['userOrders'], // Wybierz tylko dane do zapisania (np. userOrders)
            },
        ],
    },
});
