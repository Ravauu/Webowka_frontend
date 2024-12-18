<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Edytuj Użytkownika</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email:</label>
          <input v-model="form.email" type="email" id="email" required />
        </div>
        <div>
          <label for="role">Rola:</label>
          <input v-model="form.role" type="text" id="role" placeholder="np. admin" />
        </div>
        <div class="modal-actions">
          <button type="submit">Zapisz</button>
          <button type="button" @click="$emit('close')">Anuluj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close']);

const form = ref({
  email: '',
  role: '',
});

// Symulacja pobrania danych użytkownika
onMounted(async () => {
  // Tutaj pobierasz dane użytkownika, zastąp przykładowymi danymi
  form.value = {
    email: `user${props.userId}@example.com`,
    role: 'user',
  };
});

const handleSubmit = () => {
  alert(`Zaktualizowano użytkownika: ${form.value.email}, Rola: ${form.value.role}`);
  emit('close');
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
  width: 300px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #2ecc71;
  color: white;
}

button[type='button'] {
  background-color: #ccc;
}
</style>
