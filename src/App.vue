<script setup>
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

// Sprawdzenie autoryzacji przy montowaniu aplikacji
onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <div id="app">
    <Header />

    <main>
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 20px;
}

header, footer {
  width: 100%;
  color: #fff;
  padding: 10px 0;
}

header .nav {
  display: flex;
  justify-content: space-around;
}

header .nav-link {
  color: #fff;
  text-decoration: none;
}

header .nav-link:hover {
  border-radius: 5px;
}
</style>
