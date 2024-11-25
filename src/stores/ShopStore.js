import { defineStore } from 'pinia';
import ShopService from '../services/shopService.js';

export const useShopStore = defineStore('shop', {
    state: () => ({
        products: [],
        product: null,
        categories: [],
    }),

    actions: {
        // Pobierz wszystkie produkty
        async fetchProducts(skip = 0, limit = 100, category = null) {
            try {
                const response = await ShopService.getProducts(skip, limit, category);
                this.products = response;
            } catch (error) {
                console.error('Fetch products failed:', error);
                throw error;
            }
        },

        // Pobierz produkt według ID
        async fetchProductById(productId) {
            try {
                const response = await ShopService.getProductById(productId);
                this.product = response;
            } catch (error) {
                console.error('Fetch product by ID failed:', error);
                throw error;
            }
        },

        // Pobierz produkty według kategorii
        async fetchProductsByCategory(category, skip = 0, limit = 100) {
            try {
                const response = await ShopService.getProductsByCategory(category, skip, limit);
                this.products = response;
            } catch (error) {
                console.error('Fetch products by category failed:', error);
                throw error;
            }
        },

        // Dodaj nowy produkt
        async addProduct(productData) {
            try {
                const response = await ShopService.createProduct(productData);
                this.products.push(response);
            } catch (error) {
                console.error('Add product failed:', error);
                throw error;
            }
        },

        // Usuń produkt
        async deleteProduct(productId) {
            try {
                await ShopService.deleteProduct(productId);
                this.products = this.products.filter(product => product.id !== productId);
            } catch (error) {
                console.error('Delete product failed:', error);
                throw error;
            }
        },
    },
});
