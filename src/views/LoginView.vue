<script setup>
import LoginForm from '../components/auth/LoginForm.vue';
</script>

<template>
  <div class="login-container">
    <LoginForm />
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f2f2f2;
}

h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
  text-align: center;
}
</style>
