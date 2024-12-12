import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router/index.js';

const app = createApp(App);
const pinia = createPinia();

// Dodanie pluginu persistencji
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.mount('#app');
