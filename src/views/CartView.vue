<template>
  <div>
    <h1>Twój Koszyk</h1>
    <div v-if="cartItems.length === 0">Koszyk jest pusty</div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.photo_path" alt="Product image" />
        <h3>{{ item.name }}</h3>
        <p>{{ item.price }} zł</p>

        <!-- Obsługa ilości w sztukach i kg -->
        <div v-if="item.unit_type === 'sztuki'" class="quantity-control">
          <button @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">-</button>
          <span>{{ item.quantity }} szt.</span>
          <button @click="increaseQuantity(item.id)">+</button>
        </div>

        <div v-else class="quantity-control">
          <label for="quantity">Ilość (kg):</label>
          <input type="number" step="0.01" v-model.number="item.quantity" @input="updateTotalPrice(item)" />
          <span> kg</span>
        </div>

        <p>Łączna cena: {{ item.totalPrice }} zł</p>
        <button @click="removeItem(item.id)">Usuń</button>
      </div>
      <div class="cart-summary">
        <h3>Łączna cena: {{ totalPrice }} zł</h3>
        <button @click="placeOrder" :disabled="cartItems.length === 0">Złóż zamówienie</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';
import { computed } from 'vue';
import ShopService from '@/services/shopService.js';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

// Obliczanie całkowitej ceny koszyka oraz jego zawartości
const cartItems = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.totalPrice);

// Funkcja do zwiększania ilości
const increaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item) {
    item.quantity++;
    item.totalPrice = item.quantity * item.price; // Recalculating total price
    localStorage.setItem('cart', JSON.stringify(cartStore.items)); // Update localStorage
  }
};

// Funkcja do zmniejszania ilości
const decreaseQuantity = (productId) => {
  const item = cartStore.items.find(i => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
    item.totalPrice = item.quantity * item.price; // Recalculating total price
    localStorage.setItem('cart', JSON.stringify(cartStore.items)); // Update localStorage
  }
};

// Funkcja do zaktualizowania ceny przy wprowadzeniu ilości w kg
const updateTotalPrice = (item) => {
  item.totalPrice = item.quantity * item.price; // Recalculating total price when quantity changes
  localStorage.setItem('cart', JSON.stringify(cartStore.items)); // Update localStorage
};

// Funkcja usuwania produktu z koszyka
const removeItem = (productId) => {
  cartStore.removeItem(productId);
};

// Funkcja do składania zamówienia
const placeOrder = async () => {
  if (!authStore.isAuthenticated) {
    alert('Zaloguj się, aby złożyć zamówienie!');
    router.push('/login'); // Przekierowanie na stronę logowania
    return;
  }

  try {
    // Przygotowanie danych zamówienia
    const orderData = {
      products: cartStore.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        totalPrice: item.totalPrice, // Send totalPrice per item
      })),
      totalPrice: cartStore.totalPrice,
      userId: authStore.user.id,  // Użycie danych użytkownika z authStore
    };

    // Wywołanie serwisu do składania zamówienia
    const response = await ShopService.placeOrder(orderData);
    console.log('Zamówienie złożone:', response);

    // Wyczyść koszyk po złożeniu zamówienia
    cartStore.clearCart();

    // Powiadomienie o sukcesie
    alert('Zamówienie złożone pomyślnie!');

    // Przekierowanie do strony głównej po złożeniu zamówienia
    router.push('/home');
  } catch (error) {
    console.error('Błąd podczas składania zamówienia:', error);
    alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
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

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-control button {
  margin: 0 10px;
}

.quantity-control span {
  font-size: 1.2em;
}

.quantity-control input {
  width: 60px;
  text-align: center;
  margin: 0 10px;
}
</style>
