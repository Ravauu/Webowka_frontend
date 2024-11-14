<script setup>
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  authStore.logout();
  await router.push({ name: 'login' });
};

const links = [
    //tu trzeba dodać routowanie ordersów do sklepu
  { name: 'Home', route: '/home' },
  { name: 'Login', route: '/login', auth: false },
  { name: 'Register', route: '/register', auth: false },
  { name: 'Update Profile', route: '/update-profile', auth: true },
];

</script>

<template>
  <header>

  </header>

</template>

<style scoped>

</style>
