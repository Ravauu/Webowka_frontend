import './assets/main.css'
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';  // Określenie pełnej ścieżki do pliku

const app = createApp(App);
const pinia = createPinia(); // Utwórz instancję Pinia

app.use(pinia); // Użyj Pinia jako magazynu stanu
app.use(router); // Dodaj router (jeśli go używasz)
app.mount('#app'); // Zamontuj aplikację

