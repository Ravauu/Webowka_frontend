<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { register } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const fullName = ref('');

// Pola adresowe
const city = ref('');
const street = ref('');
const houseNumber = ref('');
const postalCode = ref('');

// Funkcja formatowania adresu
const formatAddress = () => {
  return `${city.value};${street.value};${houseNumber.value};${postalCode.value}`;
};

const handleRegister = async () => {
  try {
    // Przygotowanie danych użytkownika
    const userData = {
      email: email.value,
      password: password.value,
      full_name: fullName.value,
      address: formatAddress(), // Sformatowany adres
    };

    await register(userData);
    router.push('/login'); // Przekierowanie po udanej rejestracji
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<template>
  <form @submit.prevent="handleRegister">
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
/* Stylowanie form */
form {
  display: flex;
  flex-direction: column;
}

label, input, button {
  margin-bottom: 10px;
}
</style>
