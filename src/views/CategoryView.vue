<script setup>
import { ref, watch, onMounted } from 'vue';
import ShopService from '@/services/shopService.js';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart'; // Importujemy useCart

const products = ref([]);
const route = useRoute();
const { addItem } = useCart();

const loadProducts = async (category) => {
  try {
    products.value = await ShopService.getProductsByCategory(category);
    console.log('[DEBUG] Loaded products for category:', category, products.value);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
};

// Ładowanie produktów podczas montowania komponentu
onMounted(() => {
  loadProducts(route.params.category);
});

// Obserwuj zmiany w `route.params.category`
watch(
    () => route.params.category,
    (newCategory) => {
      console.log('[DEBUG] Category changed:', newCategory);
      loadProducts(newCategory);
    }
);

// Funkcja do dodawania produktu do koszyka
const addToCart = (product) => {
  addItem(product);
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
        <p class="stock" :class="{ 'out-of-stock': product.stock === 0 }">
          {{ product.stock > 0
            ? `W magazynie: ${product.stock} ${product.unit_type === 'szt.' ? 'szt.' : 'kg'}`
            : 'Brak w magazynie'
          }}
        </p>
        <button @click="addToCart(product)" :disabled="product.stock === 0">
          Dodaj do koszyka
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 20px;

}

.product-card {
  text-align: center;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
  background-color:white;
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

.stock {
  font-size: 14px;
  margin: 5px 0;
}

.stock.out-of-stock {
  color: red;
  font-weight: bold;
}

button[disabled] {
  background-color: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

button:hover:not([disabled]) {
  background-color: #e5533c;
}
</style>
