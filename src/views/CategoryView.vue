<script setup>
import { onMounted, ref } from 'vue';
import ShopService from '@/services/shopService.js';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cartStore'; // Importujemy cartStore

const cartStore = useCartStore();
const products = ref([]);
const route = useRoute();

onMounted(async () => {
  const category = route.params.category;

  try {
    products.value = await ShopService.getProductsByCategory(category);
    console.log('[DEBUG] Loaded products for category:', category, products.value);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
});

// Funkcja do dodawania produktu do koszyka
const addToCart = (product) => {
  cartStore.addItem(product);  // Dodaj produkt do store'a
  localStorage.setItem('cart', JSON.stringify(cartStore.items));  // Zapisz koszyk w localStorage
  console.log('Produkt dodany do koszyka:', product);
};
</script>

<template>
  <div>
    <h1>Produkty w kategorii: {{ route.params.category }}</h1>
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.photo_path" alt="Product image" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} zł</p>
        <button @click="addToCart(product)">Dodaj do koszyka</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 produkty w jednej linii */
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  text-align: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
  border-color: #ff6347;
}

.product-image {
  max-width: 100%;
  height: 70%;
  margin-bottom: 10px;
}
</style>
