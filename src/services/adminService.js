import axiosInstance from '/src/Instances/axiosInstance.js';

const adminService = {
    async getAllOrders() {
        const response = await axiosInstance.get('/orders');
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

    async getAllUsers() {
        const response = await axiosInstance.get('/users');
        return response.data;
    },

    async deleteUser(userId) {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    },
};

export default adminService;
