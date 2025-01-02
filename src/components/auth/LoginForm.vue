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
  <form @submit.prevent="handleLogin" class="login-form">
    <h2>Zaloguj się</h2>
    <div class="form-group">
      <label for="username">E-mail:</label>
      <input v-model="username" type="text" id="username" required />
    </div>
    <div class="form-group">
      <label for="password">Hasło:</label>
      <input v-model="password" type="password" id="password" required />
    </div>
    <button type="submit" class="btn">Zaloguj</button>
  </form>
</template>

<style scoped>
.login-form {
  width: 100%;
  max-width: 400px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:focus {
  outline: none;
  border-color: #16b978;
  box-shadow: 0 0 5px rgba(22, 185, 120, 0.5);
}

.btn {
  width: 100%;
  padding: 10px 20px;
  background-color: #16b978;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
}

.btn:hover {
  background-color: #13a065;
}
</style>
