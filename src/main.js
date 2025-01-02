import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router/index.js';

const app = createApp(App);
const pinia = createPinia();

let header = document.querySelector('header');
let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('active', window.scrollY > 0);
    });
}

if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
    window.onscroll = () => {
        menu.classList.remove('bx-x');
        navbar.classList.remove('active');
    };
}

// Dodanie pluginu persistencji
pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.mount('#app');
