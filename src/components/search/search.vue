<script setup>
import { ref } from 'vue';
import { Search2 } from '@nutui/icons-vue-taro';
const val = ref('');
</script>

<template>
  <nut-searchbar v-model="val">
    <template #rightout> Search </template>
    <template #rightin>
      <Search2 />
    </template>
  </nut-searchbar>
</template>

<style scoped>

</style>
