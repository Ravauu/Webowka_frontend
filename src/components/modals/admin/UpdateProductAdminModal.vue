<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Aktualizuj Produkt</h3>
      <form @submit.prevent="updateProduct">
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

        <button type="submit">Zaktualizuj</button>
        <button type="button" @click="$emit('close')">Anuluj</button>
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 5px;
  margin-bottom: 15px;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background-color: #007bff;
  color: white;
}

button:last-child {
  background-color: #ccc;
}
</style>
