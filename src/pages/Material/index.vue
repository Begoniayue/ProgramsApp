<template>
  <nut-radio-group v-model="val">
    <nut-radio label="1">
      <image src="../../../images/test.png" width="40" height="40"/>
      <template #icon>  <IconFont name="checked"></IconFont></template>
      <template #checkedIcon> <IconFont name="checked"  color="red"></IconFont></template>
    </nut-radio>
    <nut-radio label="2">
      <image src="../../../images/test.png" width="40" height="40"/>
      <template #icon>  <IconFont name="checked"></IconFont></template>
      <template #checkedIcon> <IconFont name="checked"  color="red"></IconFont></template>
    </nut-radio>
  </nut-radio-group>
</template>
<script setup>
import { IconFont } from '@nutui/icons-vue-taro';
import { ref } from 'vue';
const val = ref('1');
</script>
