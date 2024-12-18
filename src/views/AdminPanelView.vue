<script setup>
import { onMounted, ref } from 'vue';
import { useAdmin } from '@/composables/useAdmin';

// Import modal components
import UpdateUserAdminModal from "@/modals/admin/UpdateUserAdminModal.vue";
import DeleteUserAdminModal from "@/modals/admin/DeleteUserAdminModal.vue";
import DeleteProductAdminModal from "@/components/modals/admin/DeleteProductAdminModal.vue";

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

const selectedTab = ref('orders');
const showDeleteUserModal = ref(false);
const showUpdateUserModal = ref(false);
const selectedUserId = ref(null);

onMounted(async () => {
  if (selectedTab.value === 'orders') {
    await fetchAllOrders();
  } else {
    await fetchAllUsers();
  }
});

const handleTabSwitch = async (tab) => {
  selectedTab.value = tab;
  if (tab === 'orders') await fetchAllOrders();
  else if (tab === 'users') await fetchAllUsers();
};

const handleUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    await updateOrderStatus(orderId, newStatus);
    alert('Status zamówienia został zaktualizowany.');
  } catch (err) {
    console.error(err);
    alert('Nie udało się zaktualizować statusu zamówienia.');
  }
};

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

const openDeleteUserModal = (userId) => {
  selectedUserId.value = userId;
  showDeleteUserModal.value = true;
};

const openUpdateUserModal = (userId) => {
  selectedUserId.value = userId;
  showUpdateUserModal.value = true;
};

const closeModals = () => {
  showDeleteUserModal.value = false;
  showUpdateUserModal.value = false;
};

const handleDeleteUser = async () => {
  try {
    await deleteUser(selectedUserId.value);
    alert('Użytkownik został usunięty.');
    closeModals();
  } catch (err) {
    console.error(err);
    alert('Nie udało się usunąć użytkownika.');
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
            <select v-model="order.status" @change="handleUpdateOrderStatus(order.id, order.status)">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
          <td>
            <button @click="handleDeleteOrder(order.id)">Usuń</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Users Section -->
    <div v-if="selectedTab === 'users'">
      <h2>Użytkownicy</h2>
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
    <DeleteUserAdminModal
        v-if="showDeleteUserModal"
        :userId="selectedUserId"
        @confirm="handleDeleteUser"
        @cancel="closeModals"
    />
    <UpdateUserAdminModal
        v-if="showUpdateUserModal"
        :userId="selectedUserId"
        @close="closeModals"
    />
    <DeleteProductAdminModal
        v-if="showDeleteProductModal"
        :productId="selectedProductId"
        @confirm="handleDeleteProduct"
        @close="closeModals"
    />
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
