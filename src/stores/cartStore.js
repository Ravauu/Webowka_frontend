import { defineStore } from 'pinia';
import OrderService from '../services/orderService.js';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cart')) || [], // Wczytaj dane z localStorage
    }),
    getters: {
        // Suma wartości koszyka
        totalPrice: (state) => {
            return state.items.reduce((total, item) => total + item.totalPrice, 0);
        },
        // Liczba unikalnych produktów w koszyku
        uniqueItemCount: (state) => state.items.length, // Liczba unikalnych produktów
    },

    actions: {
        // Add item to cart
        addItem(product, quantity = 1) {
            if (product.unit_type === 'szt.' && !Number.isInteger(quantity)) {
                console.error('Nie można dodać niecałych sztuk produktu.');
                return;
            }
            if (quantity <= 0 || quantity > product.stock) {
                console.warn('Ilość przekracza dostępny stan magazynowy lub jest nieprawidłowa.');
                return;
            }

            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity + quantity <= product.stock) {
                    existingItem.quantity += quantity;
                    existingItem.totalPrice = existingItem.quantity * existingItem.price;
                } else {
                    console.warn(`Nie można dodać więcej produktów. Dostępne: ${product.stock}`);
                }
            } else {
                this.items.push({
                    ...product,
                    quantity,
                    totalPrice: quantity * product.price,
                });
            }
            this.updateLocalStorage();
        },


        // Update item in cart
        updateItemQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                if (item.unit_type === 'szt.' && !Number.isInteger(quantity)) {
                    console.error('Nie można ustawić niecałych sztuk produktu.');
                    return;
                }
                if (quantity <= 0) {
                    this.removeItem(productId);
                } else if (quantity <= item.stock) {
                    item.quantity = quantity;
                    item.totalPrice = item.quantity * item.price;
                    this.updateLocalStorage();
                } else {
                    console.warn(`Nie można ustawić ilości powyżej dostępnego stanu magazynowego: ${item.stock}`);
                }
            }
        },

        // Remove item from cart
        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateLocalStorage(); // Zapisz po usunięciu
        },

        // Clear the cart
        clearCart() {
            this.items = [];
            this.updateLocalStorage(); // Zapisz pusty koszyk
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

        // Helper to update localStorage
        updateLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        },
    },
});
