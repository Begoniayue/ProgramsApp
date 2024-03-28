<template>
  <web-view :src="url"/>
</template>
<script setup>
const url = ref('')
import { onMounted, ref } from 'vue'
import Taro, {useDidShow} from "@tarojs/taro";
useDidShow(() => {
  url.value = Taro.getCurrentInstance().router.params.url
})
</script>
