<script setup>
import {computed, ref} from 'vue';
import {useCartStore} from '@/stores/cartStore';
import {useAuthStore} from '@/stores/authStore';
import {useOrderStore} from '@/stores/orderStore'; // Import useOrderStore
import {useRouter} from 'vue-router';
import axios from 'axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const orderStore = useOrderStore(); // Inicjalizacja orderStore
const router = useRouter();

// Paginacja
const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedCartItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return cartStore.items.slice(start, end);
});

const totalPages = computed(() => Math.ceil(cartStore.items.length / itemsPerPage));
const totalPrice = computed(() => cartStore.totalPrice);

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Obsługa ilości dla sztuk
const increaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item && item.unit_type === 'szt.') {
    cartStore.updateItemQuantity(productId, item.quantity + 1);
  }
};

const decreaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item && item.unit_type === 'szt.' && item.quantity > 1) {
    cartStore.updateItemQuantity(productId, item.quantity - 1);
  }
};

// Obsługa ilości dla kilogramów
const increaseKgQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item && item.unit_type === 'kg') {
    cartStore.updateItemQuantity(productId, item.quantity + 0.25);
  }
};

const decreaseKgQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item && item.unit_type === 'kg' && item.quantity > 0.25) {
    cartStore.updateItemQuantity(productId, item.quantity - 0.25);
  }
};

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

const clearCart = () => {
  cartStore.clearCart();
  alert('Koszyk został wyczyszczony.');
};

const placeOrder = async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    alert('Zaloguj się, aby złożyć zamówienie!');
    await router.push('/login');
    return;
  }

  try {
    const orderData = {
      products: cartStore.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    console.log('Order Data:', orderData);

    // Wysyłanie zapytania do backendu z axios
    const response = await axios.post('http://localhost:8000/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${authStore.accessToken}`, // Jeśli wymagany token
      }
    });

    console.log('Zamówienie złożone:', response.data);

    alert('Zamówienie złożone pomyślnie!');
    cartStore.clearCart();

    // Ustawienie flagi w orderStore
    orderStore.shouldRefreshOrders = true;

    await router.push('/orders');
  } catch (error) {
    console.error('Błąd podczas składania zamówienia:', error);

    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Sesja wygasła. Zaloguj się ponownie.');
      authStore.logout();
      await router.push('/login');
    } else {
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
    }
  }
};
</script>

<template>
  <div class="cart-container">
    <h1>Twój Koszyk</h1>
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      Koszyk jest pusty
    </div>
    <div v-else>
      <div v-for="item in paginatedCartItems" :key="item.id" class="cart-item">
        <img :src="item.photo_path" alt="Product image" class="item-image"/>
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>{{ item.price.toFixed(2) }} zł</p>

          <div v-if="item.unit_type === 'szt.'" class="quantity-control">
            <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }} szt.</span>
            <button @click="increaseQuantity(item.id)">+</button>
          </div>

          <div v-else-if="item.unit_type === 'kg'" class="quantity-control">
            <button @click="decreaseKgQuantity(item.id)" :disabled="item.quantity <= 0.25">-</button>
            <span>{{ item.quantity.toFixed(2) }} kg</span>
            <button @click="increaseKgQuantity(item.id)">+</button>
          </div>

        </div>

        <p class="item-total">Łączna cena: {{ item.totalPrice.toFixed(2) }} zł</p>
        <button @click="removeItem(item.id)" class="remove-btn">Usuń</button>
      </div>

      <div class="pagination">
        <button @click="goToPrevPage" :disabled="currentPage === 1">Poprzednia</button>
        <span>Strona {{ currentPage }} z {{ totalPages }}</span>
        <button @click="goToNextPage" :disabled="currentPage === totalPages">Następna</button>
      </div>

      <div class="cart-summary">
        <h3>Łączna cena: {{ totalPrice.toFixed(2) }} zł</h3>
        <div class="actions">
          <button @click="clearCart" :disabled="cartStore.items.length === 0" class="clear-btn">Wyczyść koszyk</button>
          <button @click="placeOrder" :disabled="cartStore.items.length === 0" class="order-btn">
            Złóż zamówienie
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: black;
}

.empty-cart {
  text-align: center;
  font-size: 1.2em;
  color: #888;
  margin: 20px 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.item-image {
  max-width: 80px;
  max-height: 80px;
  border-radius: 8px;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.pagination button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.cart-summary {
  text-align: right;
  font-size: 1.2em;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.clear-btn, .order-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
}

.clear-btn {
  background-color: #f39c12;
  color: white;
}

.order-btn {
  background-color: #27ae60;
  color: white;
}

.clear-btn:hover {
  background-color: #e67e22;
}

.order-btn:hover {
  background-color: #1e8449;
}
</style>
