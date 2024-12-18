<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Aktualizuj Produkt</h3>
      <form @submit.prevent="updateProduct">
        <label>Nazwa:</label>
        <input v-model="form.name" />

        <label>Cena:</label>
        <input v-model.number="form.price" type="number" />

        <label>Kategoria:</label>
        <input v-model="form.product_prop" />

        <label>Ścieżka zdjęcia:</label>
        <input v-model="form.photo_path" />

        <label>Stan Magazynowy:</label>
        <input v-model.number="form.stock" type="number" />

        <button type="submit">Zaktualizuj</button>
        <button @click="$emit('close')">Anuluj</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import axiosInstance from "@/instances/axiosInstance";

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const form = reactive({
  name: "",
  price: null,
  product_prop: "",
  photo_path: "",
  stock: 0,
});

onMounted(async () => {
  const response = await axiosInstance.get(`/products/${props.productId}`);
  Object.assign(form, response.data);
});

const updateProduct = async () => {
  await axiosInstance.put(`/products/${props.productId}`, form);
  alert("Produkt został zaktualizowany.");
  emit("close");
};
</script>

<style scoped>
/* Stylizacja */
</style>
