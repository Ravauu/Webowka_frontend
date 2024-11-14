<script setup>
import Header from './components/Layout/header.vue';
import Footer from './components/Layout/footer.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app-container">
    <Header />

    <main>
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style>

</style>