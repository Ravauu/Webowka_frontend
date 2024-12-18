<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Dodaj Nowy Produkt</h3>
      <form @submit.prevent="createProduct">
        <label>Nazwa:</label>
        <input v-model="form.name" required />

        <label>Cena:</label>
        <input v-model.number="form.price" type="number" required />

        <label>Kategoria:</label>
        <input v-model="form.product_prop" required />

        <label>Ścieżka zdjęcia:</label>
        <input v-model="form.photo_path" />

        <label>Stan Magazynowy:</label>
        <input v-model.number="form.stock" type="number" />

        <button type="submit">Stwórz</button>
        <button @click="$emit('close')">Anuluj</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axiosInstance from "@/instances/axiosInstance";

const form = reactive({
  name: "",
  price: null,
  product_prop: "",
  photo_path: "",
  stock: 0,
});

const emit = defineEmits(["close"]);

const createProduct = async () => {
  await axiosInstance.post("/products", form);
  alert("Produkt został dodany.");
  emit("close");
};
</script>

<style scoped>
/* Stylizacja modala */
</style>
