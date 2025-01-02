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
      <div class="center-section">
        <router-link to="/" class="logo-container">
          <img :src="logo" alt="Delikatesy Online Logo" class="logo" />
        </router-link>
        <span class="shop-name">
        Kupiec<span class="red-text">24</span>
        </span>
        <!-- Przyciski użytkownika -->
        <div class="user-links">
          <router-link v-if="!isAuthenticated" to="/login" class="info">Zaloguj się</router-link>
          <router-link v-if="!isAuthenticated" to="/register" class="info">Zarejestruj się</router-link>
          <button v-if="isAuthenticated" @click="logout" class="info">Wyloguj się</button>
          <router-link v-if="isAuthenticated" to="/orders" class="info">Moje zamówienia</router-link>
          <button class="info" @click="goToDelivery">Dostawa</button>
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
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  padding: 15px 40px;
}

.center-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-container {
  text-align: center;
}

.logo {
  max-height: 150px;
  max-width: 150px;
  border-radius: 50%;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.1);
}

.shop-name {
  text-align: center;
  margin-bottom: 10px; /* Dystans między nazwą sklepu a przyciskami */
  font-size: 2.5em; /* Zwiększony rozmiar czcionki */
  font-weight: bold; /* Pogrubienie tekstu */
  color: #000; /* Czarny kolor dla "Kupiec" */
}

.red-text {
  color: #ff0000; /* Czerwony kolor dla "24" */
}

.user-links {
  display: flex;
  justify-content: center; /* Wyśrodkowanie */
  gap: 15px; /* Odstępy między przyciskami */
  margin-top: 10px; /* Odstęp od nazwy sklepu */
  margin-bottom: 20px; /* Odstęp od navbara */
}

.info {
  color: #333;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
}

.info:hover {
  color: #ff6347;
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
