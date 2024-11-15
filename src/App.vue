<script setup>
import Header from './components/Layout/header.vue';
import Footer from './components/Layout/footer.vue';
import { RouterView } from 'vue-router';
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
  background-color: #333;
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
  padding: 5px 10px;
}

header .nav-link:hover {
  background-color: #555;
  border-radius: 5px;
}
</style>
