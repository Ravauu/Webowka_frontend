<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3>Usuń Użytkownika</h3>
      <p>Czy na pewno chcesz usunąć użytkownika o ID {{ userId }}?</p>
      <div class="modal-actions">
        <button @click="$emit('confirm')">Tak, Usuń</button>
        <button @click="$emit('cancel')">Anuluj</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

defineEmits(['confirm', 'cancel']);
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
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:first-child {
  background-color: #e74c3c;
  color: white;
}

button:last-child {
  background-color: #ccc;
}
</style>
