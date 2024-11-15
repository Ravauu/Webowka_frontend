<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useRouter } from 'vue-router';
import logo from '@/assets/images/delikatesyonlinelogo.webp';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  authStore.logout();
  await router.push({ name: 'login' });
};

const isAuthenticated = computed(() => authStore.isAuthenticated);

const categories = [
  'Warzywa, owoce',
  'Świeże',
  'Pieczywo',
  'Spożywcze',
  'Mrożonki',
  'Woda, napoje',
  'Chemia',
  'Dzieci',
  'Zwierzęta'
];
</script>

<template>
  <header class="header">
    <div class="top-bar">
      <div class="user-links">
        <span class="info">Kurier</span>
        <router-link v-if="!isAuthenticated" to="/login" class="info">Zaloguj się</router-link>
        <router-link v-if="!isAuthenticated" to="/register" class="info">Zarejestruj się</router-link>
        <button v-if="isAuthenticated" @click="logout" class="info">Wyloguj się</button>
      </div>

      <div class="logo-container">
        <img :src="logo" alt="Delikatesy Online Logo" class="logo" />
      </div>
    </div>

    <nav class="category-bar">
      <div class="category-bar-content">
        <span
            v-for="(category, index) in categories"
            :key="index"
            class="category-link"
        >
          {{ category }}
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
  padding: 30px 0; /* Ustawienia paddingu dla górnego paska */
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
  max-height: 120px; /* Ograniczenie wysokości logo */
  max-width: 200px;  /* Ustalona szerokość */
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
  padding: 10px 0; /* Padding dla paska kategorii */
  margin-top: 10px; /* Dodatkowe przesunięcie */
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
</style>
