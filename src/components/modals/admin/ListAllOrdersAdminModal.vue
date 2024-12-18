<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Lista Zamówień</h3>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Użytkownik</th>
          <th>Status</th>
          <th>Data</th>
          <th>Łączna Cena</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user_id }}</td>
          <td>{{ order.status }}</td>
          <td>{{ new Date(order.created_at).toLocaleString() }}</td>
          <td>{{ order.total_price }} zł</td>
        </tr>
        </tbody>
      </table>
      <button @click="$emit('close')">Zamknij</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "@/instances/axiosInstance";

const orders = ref([]);

onMounted(async () => {
  const response = await axiosInstance.get("/orders");
  orders.value = response.data;
});

defineEmits(["close"]);
</script>

<style scoped>
/* Stylizacja */
</style>
