<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { login } = useAuth();
const router = useRouter();

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  //to zrobić trzeba!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
};
</script>

<template>
  <!--trzeba zrobić!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-->
</template>

<style scoped>
  /*trzeba zrobić*/
</style>