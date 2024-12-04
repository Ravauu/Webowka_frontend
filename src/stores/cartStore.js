import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
    }),
    getters: {
        totalPrice: (state) => {
            return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        itemCount: (state) => state.items.length,
    },
    actions: {
        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push({ ...product, quantity: 1 });
            }
        },
        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
        },
        clearCart() {
            this.items = [];
        },
    },
});
