<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useOrder } from '@/composables/useOrder';
import {useOrderStore} from "@/stores/orderStore.js";

const { userOrders, fetchUserOrders, fetchOrder, deleteOrder, currentOrder, loading, error } = useOrder();
const isModalVisible = ref(false);
const itemsPerPage = 5;
const currentPage = ref(1);

onMounted(async () => {
  console.log('Mounted OrderView, checking refresh...');
  const orderStore = useOrderStore();
  if (orderStore.shouldRefreshOrders) {
    console.log('Refreshing orders...');
    await fetchUserOrders(); // Pobierz zamówienia z backendu
    orderStore.resetShouldRefreshOrders(); // Resetuj flagę
  } else {
    // Załaduj dane z `localStorage` w razie potrzeby
    const savedState = localStorage.getItem('order-store');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      orderStore.userOrders = parsedState.userOrders || [];
    }
  }
});

const removeOrder = async (orderId, status) => {
  if (status !== 'pending') {
    alert('Możesz usunąć tylko zamówienia w statusie "pending".');
    return;
  }
  if (confirm('Czy na pewno chcesz usunąć to zamówienie?')) {
    try {
      await deleteOrder(orderId); // Wywołaj metodę usuwania
      alert('Zamówienie zostało pomyślnie usunięte.');
      await fetchUserOrders(); // Odśwież listę zamówień
      window.location.reload();
    } catch (error) {
      console.error('Błąd podczas usuwania zamówienia:', error);
      alert('Wystąpił błąd podczas usuwania zamówienia.');
    }
  }
};

const showOrderDetails = async (orderId) => {
  try {
    console.log('Fetching order details for ID:', orderId);
    await fetchOrder(orderId);
    await nextTick();
    console.log('Current Order:', currentOrder);
    isModalVisible.value = true;
  } catch (err) {
    console.error('Nie udało się pobrać szczegółów zamówienia:', err);
    alert('Nie udało się załadować szczegółów zamówienia.');
  }
};

const closeModal = () => {
  isModalVisible.value = false;
};

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return userOrders.slice(start, end);
});

const totalPages = computed(() => Math.ceil(userOrders.length / itemsPerPage));

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<template>
  <div class="orders-container">
    <h1>Moje Zamówienia</h1>
    <div v-if="loading">Ładowanie zamówień...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="!loading && userOrders.length === 0">Brak zamówień do wyświetlenia.</div>

    <table v-if="!loading && userOrders.length > 0" class="orders-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Data</th>
        <th>Status</th>
        <th>Akcje</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(order, index) in paginatedOrders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ new Date(order.created_at).toLocaleString() }}</td>
        <td>{{ order.status }}</td>
        <td>
          <button
              v-if="order.status === 'pending'"
              @click="removeOrder(order.id, order.status)"
              class="delete-btn"
          >
            Usuń
          </button>
          <button @click="showOrderDetails(order.id)" class="details-btn">
            Szczegóły
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination" v-if="!loading && userOrders.length > itemsPerPage">
      <button @click="goToPrevPage" :disabled="currentPage === 1">Poprzednia</button>
      <span>Strona {{ currentPage }} z {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">Następna</button>
    </div>

    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>Szczegóły Zamówienia</h2>
        <p v-if="loading">Ładowanie szczegółów zamówienia...</p>
        <div v-if="currentOrder" class="modal">
          <p><strong>Numer zamówienia:</strong> {{ currentOrder.id }}</p>
          <p><strong>Data:</strong> {{ new Date(currentOrder.created_at).toLocaleString() }}</p>
          <p><strong>Status:</strong> {{ currentOrder.status }}</p>
          <h3>Produkty:</h3>
          <ul>
            <li v-for="product in currentOrder.order_products" :key="product.product_id">
              {{ product.name }} - {{ product.quantity }} x {{ product.price.toFixed(2) }} zł
            </li>
          </ul>
        </div>
        <button @click="closeModal" class="close-btn">Zamknij</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th,
.orders-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.details-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.details-btn:hover {
  background-color: #2980b9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f2f2f2;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.close-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #c0392b;
}
</style>
