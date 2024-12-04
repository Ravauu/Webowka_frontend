<template>
  <div>
    <h1>Twój Koszyk</h1>
    <div v-if="cartItems.length === 0">Koszyk jest pusty</div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.photo_path" alt="Product image" />
        <h3>{{ item.name }}</h3>
        <p>{{ item.price }} zł</p>
        <p>Ilość: {{ item.quantity }}</p>
        <button @click="removeItem(item.id)">Usuń</button>
      </div>
      <div class="cart-summary">
        <h3>Łączna cena: {{ totalPrice }} zł</h3>
        <button @click="placeOrder">Złóż zamówienie</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';
import { ref } from 'vue';
import ShopService from '@/services/ShopService.js';

const cartStore = useCartStore();
const cartItems = ref(cartStore.items);
const totalPrice = ref(cartStore.totalPrice);

const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

const placeOrder = async () => {
  try {
    // Przykładowe dane zamówienia
    const orderData = {
      products: cartStore.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      totalPrice: cartStore.totalPrice,
    };

    const response = await ShopService.placeOrder(orderData);
    console.log('Zamówienie złożone:', response);
    cartStore.clearCart(); // Czyszczenie koszyka po złożeniu zamówienia
    alert('Zamówienie złożone pomyślnie!');
  } catch (error) {
    console.error('Błąd podczas składania zamówienia:', error);
  }
};
</script>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.cart-summary {
  margin-top: 20px;
}
</style>
