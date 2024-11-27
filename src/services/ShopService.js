import axiosInstance from '../Instances/axiosInstance.js';

const BASE_URL = import.meta.env.VITE_API_URL;

const ShopService = {
    // Pobieranie produktów na podstawie kategorii
    getProductsByCategory: (category) => {
        console.log('[DEBUG] Fetching products by category:', category);

        return axiosInstance.get(`${BASE_URL}/products/by-category/`, {
            params: { category }, // Użyjemy obiektu params
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Products by Category Response:', response.data);
            return response.data.map(product => ({
                ...product,
                photo_path: product.photo_path.replace(/\\/g, '/'),
            }));
        }).catch(error => {
            console.error('[DEBUG] Error fetching products by category:', error);
            throw error;
        });
    },

    // Pobieranie wszystkich produktów
    getProducts: (skip = 0, limit = 100, category = null) => {
        const params = { skip, limit };
        if (category) {
            params.category = category;
        }

        return axiosInstance.get(`${BASE_URL}/products`, { params })
            .then(response => response.data)
            .catch(error => {
                console.error('[DEBUG] Error fetching products:', error);
                throw error;
            });
    },

    // Pobieranie szczegółów produktu na podstawie ID
    getProductById: (productId) => {
        return axiosInstance.get(`${BASE_URL}/products/${productId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('[DEBUG] Error fetching product details:', error);
                throw error;
            });
    },

    // Dodanie nowego produktu
    createProduct: (productData) => {
        console.log('[DEBUG] Creating product:', productData);

        return axiosInstance.post(`${BASE_URL}/products`, productData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Product created:', response.data);
            return response.data;
        }).catch(error => {
            console.error('[DEBUG] Error creating product:', error);
            throw error;
        });
    },

    // Usunięcie produktu
    deleteProduct: (productId) => {
        console.log('[DEBUG] Deleting product with ID:', productId);

        return axiosInstance.delete(`${BASE_URL}/products/${productId}`)
            .then(response => {
                console.log('[DEBUG] Product deleted:', response.data);
                return response.data;
            }).catch(error => {
                console.error('[DEBUG] Error deleting product:', error);
                throw error;
            });
    },

    // Aktualizacja produktu
    updateProduct: (productId, productData) => {
        console.log('[DEBUG] Updating product:', productId, productData);

        return axiosInstance.put(`${BASE_URL}/products/${productId}`, productData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('[DEBUG] Product updated:', response.data);
            return response.data;
        }).catch(error => {
            console.error('[DEBUG] Error updating product:', error);
            throw error;
        });
    },
};

export default ShopService;
