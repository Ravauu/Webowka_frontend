<script setup>
import RegisterForm from '../components/Auth/RegisterForm.vue';
</script>

<template>
  <div class="register-container">
    <h1>Register</h1>
    <RegisterForm/>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}
</style>
