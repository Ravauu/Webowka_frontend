import axiosInstance from '../Instances/axiosInstance.js';

const BASE_URL = import.meta.env.VITE_API_URL;

const OrderService = {
    // Create a new order
    createOrder: async (orderData) => {
        console.log('[DEBUG] Creating order:', orderData);

        return axiosInstance.post(`${BASE_URL}/orders/orders/`, orderData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log('[DEBUG] Order created:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('[DEBUG] Error creating order:', error);
                throw error;
            });
    }
};

export default OrderService;
