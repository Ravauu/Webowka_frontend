<script setup>
import { onMounted, ref } from 'vue';
import { useAdmin } from '@/composables/useAdmin';

// Import modal components
import UpdateUserAdminModal from "@/components/modals/admin/UpdateUserAdminModal.vue";
import DeleteUserAdminModal from "@/components/modals/admin/DeleteUserAdminModal.vue";
import DeleteProductAdminModal from "@/components/modals/admin/DeleteProductAdminModal.vue";
import CreateProductAdminModal from "@/components/modals/admin/CreateProductAdminModal.vue";
import ListAllUsersAdminModal from "@/components/modals/admin/ListAllUsersAdminModal.vue";
import ListAllOrdersAdminModal from "@/components/modals/admin/ListAllOrdersAdminModal.vue";
import UpdateOrderAdminModal from "@/components/modals/admin/UpdateOrderAdminModal.vue";
import UpdateProductAdminModal from "@/components/modals/admin/UpdateProductAdminModal.vue";

const {
  allOrders,
  allUsers,
  fetchAllOrders,
  fetchAllUsers,
  updateOrderStatus,
  deleteOrder,
  deleteUser,
  loading,
  error,
} = useAdmin();

// Zmienne dla modali
const selectedTab = ref('orders');
const showDeleteUserModal = ref(false);
const showUpdateUserModal = ref(false);
const showCreateProductModal = ref(false);
const showDeleteProductModal = ref(false);
const showListUsersModal = ref(false);
const showListOrdersModal = ref(false);
const showUpdateOrderModal = ref(false);
const showUpdateProductModal = ref(false);

// ID dla wybranego elementu
const selectedUserId = ref(null);
const selectedProductId = ref(null);
const selectedOrderId = ref(null);

onMounted(async () => {
  if (selectedTab.value === 'orders') {
    await fetchAllOrders();
  } else {
    await fetchAllUsers();
  }
});

// Przełączanie zakładek
const handleTabSwitch = async (tab) => {
  selectedTab.value = tab;
  if (tab === 'orders') await fetchAllOrders();
  else if (tab === 'users') await fetchAllUsers();
};

// Funkcje otwierające modale
const openDeleteUserModal = (userId) => {
  selectedUserId.value = userId;
  showDeleteUserModal.value = true;
};

const openUpdateUserModal = (userId) => {
  selectedUserId.value = userId;
  showUpdateUserModal.value = true;
};

const openCreateProductModal = () => showCreateProductModal.value = true;

const openDeleteProductModal = (productId) => {
  selectedProductId.value = productId;
  showDeleteProductModal.value = true;
};

const openListUsersModal = () => showListUsersModal.value = true;
const openListOrdersModal = () => showListOrdersModal.value = true;

const openUpdateOrderModal = (orderId) => {
  selectedOrderId.value = orderId;
  showUpdateOrderModal.value = true;
};

const openUpdateProductModal = (productId) => {
  selectedProductId.value = productId;
  showUpdateProductModal.value = true;
};

const closeModals = () => {
  showDeleteUserModal.value = false;
  showUpdateUserModal.value = false;
  showCreateProductModal.value = false;
  showDeleteProductModal.value = false;
  showListUsersModal.value = false;
  showListOrdersModal.value = false;
  showUpdateOrderModal.value = false;
  showUpdateProductModal.value = false;
};

// Funkcja usuwania zamówienia
const handleDeleteOrder = async (orderId) => {
  if (confirm('Czy na pewno chcesz usunąć to zamówienie?')) {
    try {
      await deleteOrder(orderId);
      alert('Zamówienie zostało usunięte.');
    } catch (err) {
      console.error(err);
      alert('Nie udało się usunąć zamówienia.');
    }
  }
};
</script>

<template>
  <div class="admin-panel">
    <h1>Panel Administratora</h1>
    <div class="tabs">
      <button :class="{ active: selectedTab === 'orders' }" @click="handleTabSwitch('orders')">Zamówienia</button>
      <button :class="{ active: selectedTab === 'users' }" @click="handleTabSwitch('users')">Użytkownicy</button>
    </div>

    <div v-if="loading">Ładowanie...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Orders Section -->
    <div v-if="selectedTab === 'orders'">
      <h2>Zamówienia</h2>
      <button @click="openListOrdersModal">Wyświetl Wszystkie Zamówienia</button>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Użytkownik</th>
          <th>Data</th>
          <th>Status</th>
          <th>Akcje</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in allOrders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user_id }}</td>
          <td>{{ new Date(order.created_at).toLocaleString() }}</td>
          <td>
            <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td>
            <button @click="openUpdateOrderModal(order.id)">Edytuj</button>
            <button @click="handleDeleteOrder(order.id)">Usuń</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Users Section -->
    <div v-if="selectedTab === 'users'">
      <h2>Użytkownicy</h2>
      <button @click="openListUsersModal">Wyświetl Wszystkich Użytkowników</button>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th>Role</th>
          <th>Akcje</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in allUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.roles.join(', ') }}</td>
          <td>
            <button @click="openUpdateUserModal(user.id)">Edytuj</button>
            <button @click="openDeleteUserModal(user.id)">Usuń</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <CreateProductAdminModal v-if="showCreateProductModal" @close="closeModals" />
    <DeleteProductAdminModal v-if="showDeleteProductModal" :productId="selectedProductId" @close="closeModals" />
    <ListAllOrdersAdminModal v-if="showListOrdersModal" @close="closeModals" />
    <ListAllUsersAdminModal v-if="showListUsersModal" @close="closeModals" />
    <UpdateOrderAdminModal v-if="showUpdateOrderModal" :orderId="selectedOrderId" @close="closeModals" />
    <UpdateProductAdminModal v-if="showUpdateProductModal" :productId="selectedProductId" @close="closeModals" />
    <DeleteUserAdminModal v-if="showDeleteUserModal" :userId="selectedUserId" @confirm="deleteUser" @close="closeModals" />
    <UpdateUserAdminModal v-if="showUpdateUserModal" :userId="selectedUserId" @close="closeModals" />
  </div>
</template>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

table th {
  background-color: #f7f7f7;
}

button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
}

button:hover {
  background-color: #c0392b;
}
</style>
