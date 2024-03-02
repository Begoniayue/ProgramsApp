<template>
  <view>素材库</view>
  <view>素材库</view>
  <nut-form>
    <nut-form-item label="作品加密">
      <nut-radio-group v-model="formData.radio" direction="horizontal">
        <nut-radio label="1">选项1</nut-radio>
        <nut-radio label="3">选项3</nut-radio>
      </nut-radio-group>
    </nut-form-item>
    <nut-form-item label="作品标题">
      <nut-input v-model="formData.name" placeholder="请输入姓名" type="text" />
    </nut-form-item>
    <nut-form-item label="全景作者">
      <nut-input v-model="formData.name" placeholder="请输入姓名" type="text" />
    </nut-form-item>
    <nut-form-item label="设计说明">
      <nut-textarea placeholder="请输入备注" type="text" />
    </nut-form-item>
    <nut-form-item label="设计说明">
      <nut-textarea placeholder="请输入备注" type="text" />
    </nut-form-item>
    <nut-form-item label="开关">
      <nut-switch v-model="formData.music"></nut-switch>
    </nut-form-item>
    <nut-form-item label="开关">
      <nut-switch v-model="formData.switch"></nut-switch>
    </nut-form-item>
  </nut-form>
</template>
<script setup>
import { ref } from 'vue';
import { Taro } from '@tarojs/taro';
const formData = ref({
  switch: false,
  radio: 0,
  music:'',
})
// 在 onLoad 生命周期中监听事件
Taro.onLoad(() => {
  // 通过 Taro 对象的事件监听方式监听事件
  Taro.eventCenter.on('updateFormData', (resultData) => {
    // 更新表单数据
    Object.assign(formData, resultData);
  });
});
</script>
