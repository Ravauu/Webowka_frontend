<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { login } = useAuth();
const router = useRouter();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await login({ username: username.value, password: password.value });
    await router.push('/home'); // Przekierowanie po udanym logowaniu
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<template>
    <form @submit.prevent="handleLogin">
      <label for="username">Username:</label>
      <input v-model="username" type="text" id="username" required />

      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Login</button>
    </form>
</template>

<style scoped>
  /*trzeba zrobić*/
</style>