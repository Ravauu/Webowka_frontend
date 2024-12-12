import axiosInstance from '/src/Instances/axiosInstance.js';

const orderService = {
    async createOrder(orderData) {
        const response = await axiosInstance.post('/orders', orderData);
        return response.data;
    },

    async getOrders() {
        const response = await axiosInstance.get('/orders');
        return response.data;
    },

    async getUserOrders() {
        const response = await axiosInstance.get('/my-orders');
        console.log('Response from /my-orders:', response.data); // Log odpowiedzi serwera
        return response.data;
    },

    async getOrder(orderId) {
        console.log(`Fetching order with ID: ${orderId}`);
        const response = await axiosInstance.get(`/orders/${orderId}`);
        console.log('Order response data:', response.data);
        return response.data;
    },

    async updateOrderStatus(orderId, status) {
        const response = await axiosInstance.put(`/orders/${orderId}/status`, { order_status: status });
        return response.data;
    },

    async deleteOrder(orderId) {
        const response = await axiosInstance.delete(`/orders/${orderId}`);
        return response.data;
    },
};

export default orderService;
