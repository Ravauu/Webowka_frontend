<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { register } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const fullName = ref('');
const city = ref('');
const street = ref('');
const houseNumber = ref('');
const postalCode = ref('');

const handleRegister = async () => {
  try {
    const userData = {
      email: email.value,
      password: password.value,
      full_name: fullName.value,
      address: `${city.value};${street.value};${houseNumber.value};${postalCode.value}`,
    };
    await register(userData);
    await router.push('/login'); // Przekierowanie na login po udanej rejestracji
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<template>
  <form @submit.prevent="handleRegister">
    <h1>Register</h1>

    <label for="email">Email:</label>
    <input v-model="email" type="email" id="email" required />

    <label for="password">Password:</label>
    <input v-model="password" type="password" id="password" required />

    <label for="fullName">Full Name:</label>
    <input v-model="fullName" type="text" id="fullName" required />

    <label for="city">City:</label>
    <input v-model="city" type="text" id="city" required />

    <label for="street">Street:</label>
    <input v-model="street" type="text" id="street" required />

    <label for="houseNumber">House Number:</label>
    <input v-model="houseNumber" type="text" id="houseNumber" required />

    <label for="postalCode">Postal Code:</label>
    <input v-model="postalCode" type="text" id="postalCode" required />

    <button type="submit">Register</button>
  </form>
</template>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
