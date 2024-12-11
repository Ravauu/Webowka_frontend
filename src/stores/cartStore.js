import { defineStore } from 'pinia';
import OrderService from '../services/orderService.js';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cart')) || [], // Wczytaj dane z localStorage
    }),
    getters: {
        totalPrice: (state) => {
            return state.items.reduce((total, item) => total + item.totalPrice, 0);
        },
        itemCount: (state) => state.items.length,
    },
    actions: {
        // Add item to cart
        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.quantity * existingItem.price; // Recalculating total price
            } else {
                this.items.push({ ...product, quantity: 1, totalPrice: product.price });
            }
            localStorage.setItem('cart', JSON.stringify(this.items)); // Aktualizacja localStorage po dodaniu
        },

        // Remove item from cart
        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(this.items)); // Zapisz po usunięciu
        },

        // Clear the cart
        clearCart() {
            this.items = [];
            localStorage.setItem('cart', JSON.stringify(this.items)); // Zapisz pusty koszyk
        },

        // Place an order with the current cart items
        async placeOrder(userDetails) {
            const orderData = {
                userDetails,
                items: this.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice, // Send totalPrice per item
                })),
                totalPrice: this.totalPrice,
            };

            try {
                // Send the order to the backend using OrderService
                const order = await OrderService.createOrder(orderData);

                // Clear the cart after successful order placement
                this.clearCart();

                return order;
            } catch (error) {
                console.error('Error placing order:', error);
                throw error;
            }
        },
    },
});
