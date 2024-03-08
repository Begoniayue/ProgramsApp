<template>
  <nut-cell-group>
    <nut-cell title="公开到全景主页" round-radius="0">
      <template #link>
        <nut-switch :model-value="homeFlag" @change="changehomeFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="公开到微官网" round-radius="0">
      <template #link>
        <nut-switch :model-value="webFlag" @change="changeWebFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="展示微官网图标" round-radius="0">
      <template #link>
        <nut-switch :model-value="webIconFlag" @change="changeWebIconFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="去除建E网水印" round-radius="0">
      <template #link>
        <nut-switch :model-value="waterFlag" @change="changeWaterFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
  </nut-cell-group>
</template>
<script setup>
const panoid = ref('')
const homeFlag = ref(false)
const webFlag = ref(false)
const webIconFlag = ref(false)
const waterFlag = ref(false)
import { onMounted, ref } from 'vue'
import Taro  from "@tarojs/taro";
onMounted(() => {
  panoid.value = Taro.getCurrentInstance().router.params.panoid
})
const changehomeFlag = (value) => {
  homeFlag.value = value
  moreSet('1', value)
}
const changeWebFlag = (value) => {
  webFlag.value = value
  moreSet('2', value)
}
const changeWebIconFlag = (value) => {
  webIconFlag.value = value
  moreSet('3', value)
}
const changeWaterFlag = (value) => {
  waterFlag.value = value
  moreSet('4', value)
}
const moreSet = (value,open) => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_more',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uid:'39',
      type: value,
      panoid: panoid.value,
      is_open: open?'1':'0',
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      Taro.showToast({
        title: '成功',
        icon: 'success',
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
</script>
