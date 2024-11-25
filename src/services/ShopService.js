import axiosInstance from '../Instances/axiosInstance.js';

const BASE_URL = import.meta.env.VITE_API_URL;

const ShopService = {
    // Pobierz wszystkie produkty
    getProducts(skip = 0, limit = 100, category = null) {
        const params = { skip, limit };
        if (category) params.category = category;

        return axiosInstance.get(`${BASE_URL}/products`, { params })
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching products:', error);
                throw error;
            });
    },

    // Pobierz produkt według ID
    getProductById(productId) {
        return axiosInstance.get(`${BASE_URL}/products/${productId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching product by ID:', error);
                throw error;
            });
    },

    // Pobierz produkty według kategorii
    getProductsByCategory(category, skip = 0, limit = 100) {
        return axiosInstance.get(`${BASE_URL}/products/category/${category}`, {
            params: { skip, limit },
        }).then(response => response.data)
            .catch(error => {
                console.error('Error fetching products by category:', error);
                throw error;
            });
    },

    // Dodaj nowy produkt
    createProduct(productData) {
        return axiosInstance.post(`${BASE_URL}/products`, productData)
            .then(response => response.data)
            .catch(error => {
                console.error('Error adding product:', error);
                throw error;
            });
    },

    // Usuń produkt
    deleteProduct(productId) {
        return axiosInstance.delete(`${BASE_URL}/products/${productId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error deleting product:', error);
                throw error;
            });
    },
};

export default ShopService;
