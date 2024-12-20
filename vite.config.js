import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'path'; // Importujemy 'path'
import dotenv from 'dotenv'; // Dodano dotenv do obsługi zmiennych środowiskowych

// Wczytujemy zmienne środowiskowe
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    // Wsparcie dla CSS i opcje preprocessora
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/variables.scss";`,
      },
    },
  },
  define: {
    'process.env': {
      VITE_GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY, // Dodano klucz API z pliku .env
    },
  },
  server: {
    port: 5173, // Ustawienie portu
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Adres Twojego backendu
        changeOrigin: true,
        secure: false,  // Jeśli masz problemy z SSL, możesz ustawić na 'false'
        pathRewrite: {
          '^/api': '',  // Zastąp '/api' odpowiednią ścieżką w backendzie
        },
      },
    },
  },
});