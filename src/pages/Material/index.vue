<template>
  <view class="material-wrap">
    <view class="home-search-wrap">
      <nut-searchbar v-model="searchValue" placeholder="搜索素材库">
        <template #rightin>
          <IconFont name="search"></IconFont>
        </template>
      </nut-searchbar>
    </view>
    <nut-tabs v-model="materialType" align="left" @change="getMaterial">
      <nut-tab-pane title="原创" pane-key="-1" class="book-list">
        <nut-radio-group v-model="MaterialVal">
          <nut-radio :label="item.sceneid" v-for="item in materialList" :key="item.id">
            <image :src=item.preview class="material-image" mode="aspectFit" />
            <template #icon> </template>
            <template #checkedIcon> <IconFont name="checked"  color="#6C6BFC"></IconFont></template>
          </nut-radio>
        </nut-radio-group>
      </nut-tab-pane>
      <nut-tab-pane title="已购" pane-key="1" class="book-list">
        <nut-radio-group v-model="MaterialVal">
          <nut-radio :label="item.sceneid" v-for="item in materialList" :key="item.id">
            <image :src=item.preview class="material-image" mode="aspectFit" />
            <template #icon> </template>
            <template #checkedIcon> <IconFont name="checked"  color="#6C6BFC"></IconFont></template>
          </nut-radio>
        </nut-radio-group>
      </nut-tab-pane>
      <nut-tab-pane title="VIP场景" pane-key="6" class="book-list">
        <nut-radio-group v-model="MaterialVal">
          <nut-radio :label="item.sceneid" v-for="item in materialList" :key="item.id">
            <image :src=item.preview class="material-image" mode="aspectFit" />
            <template #icon> </template>
            <template #checkedIcon> <IconFont name="checked"  color="#6C6BFC"></IconFont></template>
          </nut-radio>
        </nut-radio-group>
      </nut-tab-pane>
    </nut-tabs>
    <view @click="saveMaterial" class="save-btn">
      保存
    </view>
  </view>
</template>
<script setup>
import Taro, {useDidShow} from "@tarojs/taro";
import './index.scss'
import { IconFont } from '@nutui/icons-vue-taro';
import {onMounted, ref} from 'vue';
const MaterialVal = ref('');
const MaterialValBuy = ref('');
const MaterialValVip = ref('');

const materialPage = ref(1)
const materialType = ref('-1')
const searchValue = ref('')
const materialList= ref([])
const getMaterial = () => {
  const data = {
    page: materialPage.value,
    type: materialType.value,
    keywords: searchValue.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  MaterialVal.value = ''
  Taro.removeStorageSync('materialList')
  Taro.removeStorageSync('materiaPreview')
  console.log('getMaterial',materialType.value)
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/scene_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) =>{
    if (res.statusCode === 200) {
      const uniqueMaterials = [...new Map(res.data.data.map(item => [item.preview, item])).values()];
      materialList.value = uniqueMaterials;
      console.log('materialList',materialList.value)
    } else {
      throw new Error('Failed to fetch data');
    }
  })
}
import CryptoJS from 'crypto-js';
import generateAndEncryptToken from "../../util/sort";
async function saveMaterial() {
  try {
    // const newValues = materialList.value
    //     .filter(item => MaterialVal.value === item.sceneid) // 根据目标值筛选出符合条件的项
    //     .map(item => item.preview)
    // 保存数据到本地存储
    await Taro.setStorageSync('materialList', MaterialVal.value);
    // await Taro.setStorageSync('materiaPreview', newValues);
    // 显示保存成功的提示
    Taro.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 2000
    });
    // 返回上一页面
    Taro.navigateBack({
      delta: 1
    });
  } catch (error) {
    console.error('Error saving material data:', error);
  }
}
useDidShow(()=>{
  getMaterial();
})
</script>
