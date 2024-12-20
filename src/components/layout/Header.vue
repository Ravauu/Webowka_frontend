<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useRouter } from 'vue-router';
import logo from '@/assets/images/delikatesyonlinelogo.webp';
import ShopService from '@/services/shopService.js';
import { useCartStore } from '@/stores/cartStore';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const logout = async () => {
  authStore.logout();
  await router.push({ name: 'login' });
};

// Flagi dla obsługi modalu
const isHoveringButton = ref(false);
const isHoveringModal = ref(false);

// Obsługa widoczności modalu
const shouldShowModal = computed(() => isHoveringButton.value || isHoveringModal.value);

const currentPage = ref(1);
const itemsPerPage = 5;

// Obsługa paginacji w modalu koszyka
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return cartStore.items.slice(start, end);
});

const totalPages = computed(() => Math.ceil(cartStore.items.length / itemsPerPage));

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const isAuthenticated = computed(() => authStore.isAuthenticated);

// Liczba unikalnych produktów w koszyku
const cartItemCount = computed(() => cartStore.uniqueItemCount);

const categories = [
  { name: 'Warzywa', path: 'warzywo' },
  { name: 'Owoce', path: 'owoc' },
  { name: 'Świeże', path: 'swieze' },
  { name: 'Pieczywo', path: 'pieczywo' },
  { name: 'Spożywcze', path: 'spozywcze' },
  { name: 'Mrożonki', path: 'mrozonki' },
  { name: 'Napoje', path: 'napoje' },
  { name: 'Chemia', path: 'chemia' },
  { name: 'Dzieci', path: 'dzieci' },
  { name: 'Zwierzęta', path: 'zwierzeta' },
];

const navigateToCategory = async (path) => {
  try {
    await ShopService.getProductsByCategory(path);
    await router.push({ path: `/category/${path}` });
  } catch (error) {
    console.error('Error fetching category products:', error);
  }
};

const goToDelivery = () => {
  router.push('/delivery');
};

// Wczytaj dane koszyka na początku
onMounted(() => {
  cartStore.items = JSON.parse(localStorage.getItem('cart')) || [];
});
</script>

<template>
  <header class="header">
    <div class="top-bar">
      <span class="left-text">masz quest, przenies przyciski wszystkie na lewo, a na prawo od tekstu sklep internetowy daj koszyk</span>
      <div class="logo-container">
        <router-link to="/">
          <img :src="logo" alt="Delikatesy Online Logo" class="logo" />
        </router-link>
      </div>
      <span class="right-text">Sklep internetowy</span>
    </div>

    <div class="user-links">
      <router-link v-if="!isAuthenticated" to="/login" class="info">Zaloguj się</router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="info">Zarejestruj się</router-link>
      <button v-if="isAuthenticated" @click="logout" class="info">Wyloguj się</button>
      <router-link v-if="isAuthenticated" to="/orders" class="info">Moje zamówienia</router-link>
      <button class="info" @click="goToDelivery">Dostawa</button>
      <div
          class="cart-container"
          v-if="isAuthenticated"
          @mouseenter="isHoveringButton = true"
          @mouseleave="isHoveringButton = false"
      >
        <router-link to="/cart">
          <button class="cart-btn">
            Mój koszyk
            <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
          </button>
        </router-link>

        <!-- Modal koszyka -->
        <div
            v-if="shouldShowModal"
            class="cart-modal"
            @mouseenter="isHoveringModal = true"
            @mouseleave="isHoveringModal = false"
        >
          <div class="pagination">
            <button @click="goToPrevPage" :disabled="currentPage === 1">Poprzednia</button>
            <span>Strona {{ currentPage }} z {{ totalPages }}</span>
            <button @click="goToNextPage" :disabled="currentPage === totalPages">Następna</button>
          </div>
          <h2>Koszyk</h2>
          <ul>
            <li v-for="item in paginatedItems" :key="item.id">
              {{ item.name }} - {{ item.quantity }} x {{ item.price.toFixed(2) }} zł
            </li>
          </ul>
        </div>
      </div>
    </div>

    <nav class="category-bar">
      <div class="category-bar-content">
        <span
            v-for="(category, index) in categories"
            :key="index"
            class="category-link"
            @click="navigateToCategory(category.path)"
        >
          {{ category.name }}
        </span>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  font-family: Arial, sans-serif;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #f2f2f2;
  padding: 15px 40px;
}

.logo-container {
  flex-shrink: 0;
  text-align: center;
}

.logo {
  max-height: 120px;
  max-width: 120px;
  border-radius: 50%;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.1);
}

.left-text,
.right-text {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.left-text {
  text-align: left;
}

.right-text {
  text-align: right;
}

.user-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.info {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.info:hover {
  color: #ff6347;
}

.cart-container {
  position: relative;
}

.cart-btn {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  margin-left: 20px;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 5px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-modal {
  position: absolute;
  top: 38px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  color: black;
}

.cart-modal ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-modal li {
  margin: 5px 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.pagination button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.category-bar {
  background-color: #ffffff;
  border-top: 2px solid #ff6347;
  border-bottom: 2px solid #ff6347;
  padding: 10px 0;
  margin-top: 10px;
  width: 100%;
}

.category-bar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.category-link {
  margin: 5px 10px;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  text-transform: uppercase;
}

.category-link:hover {
  color: #ff6347;
}
</style>
