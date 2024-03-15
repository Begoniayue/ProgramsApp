<template>
  <web-view :src="url"/>
</template>
<script setup>
const url = ref('')
import { onMounted, ref } from 'vue'
import Taro  from "@tarojs/taro";
onMounted(() => {
  console.log(Taro.getCurrentInstance().router.params.url)
  url.value = Taro.getCurrentInstance().router.params.url
})
</script>
