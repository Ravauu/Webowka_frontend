<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Szczegóły Zamówienia</h3>
      <p><strong>ID Zamówienia:</strong> {{ orderDetails.id }}</p>
      <p><strong>Status:</strong> {{ orderDetails.status }}</p>
      <p><strong>Łączna Cena:</strong> {{ orderDetails.total_price }}</p>
      <h4>Produkty:</h4>
      <ul>
        <li v-for="product in orderDetails.order_products" :key="product.product_id">
          {{ product.name }} - {{ product.quantity }} x {{ product.price }} ({{ product.unit_type }})
        </li>
      </ul>
      <button @click="$emit('close')">Zamknij</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import orderService from "@/services/orderService";

const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const orderDetails = ref(null);

onMounted(async () => {
  try {
    orderDetails.value = await orderService.getOrder(props.orderId);
  } catch (error) {
    console.error("Nie udało się pobrać szczegółów zamówienia:", error);
  }
});
</script>

<style scoped>
/* Stylizacja modału */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
