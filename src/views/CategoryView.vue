<script setup>
import { onMounted, ref } from 'vue';
import AuthService from '@/services/authServices.js';
import { useRoute } from 'vue-router';

const products = ref([]);
const route = useRoute();

// Mapowanie kategorii na product_prop
const mapCategoryToProp = {
  warzywa_owoce: ['warzywo', 'owoc'], // Mieszana kategoria
  swieze: 'swieze',
  pieczywo: 'pieczywo',
  spozywcze: 'spozywcze',
  mrozonki: 'mrozonki',
  woda_napoje: 'napoje',
  chemia: 'chemia',
  dzieci: 'dzieci',
  zwierzeta: 'zwierzeta',
};

onMounted(async () => {
  const category = route.params.category;
  const productProps = mapCategoryToProp[category];

  try {
    if (Array.isArray(productProps)) {
      // Jeśli kategoria ma więcej niż jedną wartość
      const results = await Promise.all(
          productProps.map((prop) => AuthService.getProductsByCategory(prop))
      );
      products.value = results.flat(); // Połącz wyniki z wielu zapytań
    } else {
      products.value = await AuthService.getProductsByCategory(productProps);
    }
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
}

.product-image {
  max-width: 100%;
  height: auto;
}
</style>
