<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useOrder } from '@/composables/useOrder';
import { useOrderStore } from "@/stores/orderStore.js";

const { fetchUserOrders, fetchOrder, deleteOrder, currentOrder, loading, error } = useOrder();
const orderStore = useOrderStore();

const isModalVisible = ref(false);
const itemsPerPage = 5;
const currentPage = ref(1);

const productsPerPage = 5; // Liczba produktów na stronę w szczegółach zamówienia
const currentProductPage = ref(1);

const paginatedProducts = computed(() => {
  if (!currentOrder || !currentOrder.order_products) return [];
  const start = (currentProductPage.value - 1) * productsPerPage;
  const end = start + productsPerPage;
  return currentOrder.order_products.slice(start, end);
});

const totalProductPages = computed(() => {
  if (!currentOrder || !currentOrder.order_products) return 0;
  return Math.ceil(currentOrder.order_products.length / productsPerPage);
});

const goToNextProductPage = () => {
  if (currentProductPage.value < totalProductPages.value) {
    currentProductPage.value++;
  }
};

const goToPrevProductPage = () => {
  if (currentProductPage.value > 1) {
    currentProductPage.value--;
  }
};

const resetProductPagination = () => {
  currentProductPage.value = 1;
};

onMounted(async () => {
  try {
    console.log("Fetching user orders...");
    await fetchUserOrders();
    console.log("Fetched user orders:", orderStore.userOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
  }
});

const removeOrder = async (orderId, status) => {
  if (status !== 'pending') {
    alert('Możesz usunąć tylko zamówienia w statusie "pending".');
    return;
  }
  if (confirm('Czy na pewno chcesz usunąć to zamówienie?')) {
    try {
      await deleteOrder(orderId);
      alert('Zamówienie zostało pomyślnie usunięte.');
      await fetchUserOrders();
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
    resetProductPagination();
    await nextTick();
    isModalVisible.value = true;
  } catch (err) {
    console.error('Nie udało się pobrać szczegółów zamówienia:', err);
    alert('Nie udało się załadować szczegółów zamówienia.');
  }
};

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return orderStore.userOrders.slice(start, end);
});

const totalPages = computed(() => Math.ceil(orderStore.userOrders.length / itemsPerPage));

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
    <div v-if="!loading && orderStore.userOrders.length === 0">Brak zamówień do wyświetlenia.</div>

    <table v-if="!loading && orderStore.userOrders.length > 0" class="orders-table">
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

    <div class="pagination" v-if="!loading && orderStore.userOrders.length > itemsPerPage">
      <button @click="goToPrevPage" :disabled="currentPage === 1">Poprzednia</button>
      <span>Strona {{ currentPage }} z {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">Następna</button>
    </div>

    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>Szczegóły Zamówienia</h2>
        <p><strong>Numer zamówienia:</strong> {{ currentOrder.id }}</p>
        <p><strong>Data:</strong> {{ new Date(currentOrder.created_at).toLocaleString() }}</p>
        <p><strong>Status:</strong> {{ currentOrder.status }}</p>
        <h3>Produkty:</h3>
        <table class="product-details">
          <thead>
          <tr>
            <th>Zdjęcie</th>
            <th>Produkt</th>
            <th>Ilość</th>
            <th>Jednostka</th>
            <th>Cena (szt.)</th>
            <th>Łączna Cena</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="product in paginatedProducts" :key="product.product_id">
            <td>
              <img :src="product.photo_path" alt="Zdjęcie produktu" class="product-image" />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.quantity }}</td>
            <td>{{ product.unit_type }}</td>
            <td>{{ product.price.toFixed(2) }} zł</td>
            <td>{{ (product.quantity * product.price).toFixed(2) }} zł</td>
          </tr>
          </tbody>
        </table>
        <div class="pagination" v-if="totalProductPages > 1">
          <button @click="goToPrevProductPage" :disabled="currentProductPage === 1">
            Poprzednia
          </button>
          <span>Strona {{ currentProductPage }} z {{ totalProductPages }}</span>
          <button @click="goToNextProductPage" :disabled="currentProductPage === totalProductPages">
            Następna
          </button>
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
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal h2 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

.modal table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.modal th {
  background-color: #f8f8f8;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.modal td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.close-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.close-btn:hover {
  background-color: #c0392b;
}

.modal td:first-child {
  width: 70px;
}

.modal td:nth-child(2) {
  text-align: left;
}

.modal td:last-child {
  font-weight: bold;
}

.product-details {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-details th,
.product-details td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.product-details th {
  background-color: #f9f9f9;
  font-size: 0.9rem;
}

.product-details td {
  font-size: 0.9rem;
  color: #555;
}

.product-details .product-image {
  margin: 0 auto;
}
</style>