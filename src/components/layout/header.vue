<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useRouter } from 'vue-router';
import logo from '@/assets/images/delikatesyonlinelogo.webp';
import ShopService from '@/services/shopService.js';
import { useCartStore } from '@/stores/cartStore'; // Dodajemy store do koszyka

const authStore = useAuthStore();
const cartStore = useCartStore(); // Dostęp do koszyka
const router = useRouter();

const logout = async () => {
  authStore.logout();
  await router.push({ name: 'login' });
};

const isAuthenticated = computed(() => authStore.isAuthenticated);
const cartItemCount = computed(() => cartStore.itemCount); // Liczba produktów w koszyku

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
    console.log('[DEBUG] Navigating to category:', path);
    await ShopService.getProductsByCategory(path);
    router.push({path: `/category/${path}`});
  } catch (error) {
    console.error('Error fetching category products:', error);
  }
};

</script>

<template>
  <header class="header">
    <div class="top-bar">
      <div class="user-links">
        <span class="info">Kurier</span>
        <router-link v-if="!isAuthenticated" to="/login" class="info">Zaloguj się</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="info">Zarejestruj się</router-link>
        <button v-if="isAuthenticated" @click="logout" class="info">Wyloguj się</button>
        <!-- Przycisk Mój koszyk -->
        <router-link to="/cart" v-if="isAuthenticated">
          <button class="cart-btn">
            Mój koszyk
            <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
          </button>
        </router-link>
      </div>

      <div class="logo-container">
        <img :src="logo" alt="Delikatesy Online Logo" class="logo"/>
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
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  color: #333;
  font-size: 14px;
  padding: 30px 0;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
}

.logo-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.logo {
  max-height: 120px;
  max-width: 200px;
}

.user-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.info {
  color: #333;
  text-decoration: none;
  cursor: pointer;
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
  box-sizing: border-box;
}

.category-bar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.category-link {
  margin: 0 20px;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
}

.category-link:hover {
  color: #ff6347;
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
  padding: 5px;
  font-size: 12px;
}
</style>
