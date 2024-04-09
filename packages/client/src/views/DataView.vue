<template>
  <div class="about">
    <h1>This is the response from /data:</h1>
  </div>
  <div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const items = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/data');
    if (response.ok) {
      const data = await response.json();
      items.value = data;
    } else {
      console.error('Error fetching data:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
</script>

<style>

</style>