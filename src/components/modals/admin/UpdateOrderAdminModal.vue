<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Aktualizuj Zamówienie</h3>
      <label>Status Zamówienia:</label>
      <select v-model="status">
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <div>
        <button @click="updateOrder">Zapisz</button>
        <button @click="$emit('close')">Anuluj</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosInstance from "@/instances/axiosInstance";

const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
});

const status = ref("pending");

const emit = defineEmits(["close"]);

const updateOrder = async () => {
  await axiosInstance.put(`/orders/${props.orderId}/status`, { status: status.value });
  alert("Status zamówienia zaktualizowany.");
  emit("close");
};
</script>

<style scoped>
/* Stylizacja */
</style>
