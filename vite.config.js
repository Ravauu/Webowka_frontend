import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path' // <-- Dodaj to, aby zaimportować 'path'

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
    // Dodajemy wsparcie dla CSS i opcje preprocessora, jeśli chcesz dodać SCSS czy inne preprocessory
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/variables.scss";` // Jeśli masz zmienne SCSS
      },
    },
  },
})
