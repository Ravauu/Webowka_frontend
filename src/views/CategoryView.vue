<script setup>
import { onMounted, ref } from 'vue';
import ShopService from '@/services/ShopService.js';
import { useRoute } from 'vue-router';

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
</script>

<template>
  <div>
    <h1>Produkty w kategorii: {{ route.params.category }}</h1>
    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.photo_path" alt="Product image" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} zł</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  height: auto;
  margin-bottom: 10px;
}
</style>
