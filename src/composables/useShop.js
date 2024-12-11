import { computed } from 'vue';
import { useShopStore } from '@/stores/shopStore.js';

export function useShop() {
    const shopStore = useShopStore();

    const fetchProducts = async (skip = 0, limit = 100, category = null) => {
        await shopStore.fetchProducts(skip, limit, category);
    };

    const fetchProductById = async (productId) => {
        await shopStore.fetchProductById(productId);
    };

    const fetchProductsByCategory = async (category, skip = 0, limit = 100) => {
        await shopStore.fetchProductsByCategory(category, skip, limit);
    };

    const addProduct = async (productData) => {
        await shopStore.addProduct(productData);
    };

    const deleteProduct = async (productId) => {
        await shopStore.deleteProduct(productId);
    };

    const products = computed(() => shopStore.products);
    const product = computed(() => shopStore.product);

    return {
        fetchProducts,
        fetchProductById,
        fetchProductsByCategory,
        addProduct,
        deleteProduct,
        products,
        product,
    };
}
