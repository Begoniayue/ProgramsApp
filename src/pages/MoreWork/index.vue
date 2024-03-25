<template>
  <nut-cell-group>
    <nut-cell title="公开到全景主页" round-radius="0">
      <template #link>
        <nut-switch :model-value="homeFlag " @change="changehomeFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="公开到微官网" round-radius="0">
      <template #title>
        <view style="position: relative">
          公开到微官网
          <view class="vip-icon" v-if="vip === '0'">
            <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
          </view>
        </view>
      </template>
      <template #link>
        <nut-switch :model-value="webFlag" @change="changeWebFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="展示微官网图标" round-radius="0">
      <template #title>
        <view style="position: relative">
          展示微官网图标
          <view class="vip-icon" v-if="vip === '0'">
            <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
          </view>
        </view>
      </template>
      <template #link>
        <nut-switch :model-value="webIconFlag" @change="changeWebIconFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="去除作品水印" round-radius="0">
      <template #title>
        <view style="position: relative">
          去除作品水印
          <view class="vip-icon" v-if="vip === '0'">
            <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
          </view>
        </view>
      </template>
      <template #link>
        <nut-switch :model-value="waterFlag" @change="changeWaterFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
    <nut-cell title="中英文切换" round-radius="0" :desc="LanguageFlag ? '当前英文':''">
      <template #title>
        <view style="position: relative">
          中英文切换
          <view class="vip-icon" v-if="vip === '0'">
            <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
          </view>
        </view>
      </template>
      <template #link>
        <nut-switch :model-value="LanguageFlag" @change="changeLanguageFlag" active-color="#6C6BFC"/>
      </template>
    </nut-cell>
  </nut-cell-group>
  <view class="delete" @click="deletePano">删除作品</view>
<!--  -->
  <deleteDilaog
      :dialogVisible="dialogVisible"
      @ok="deletePanoConfirm"
      @cancel="deletePanoCancel"
  />
<!--  -->
  <VipDilaog
      :dialogVisible="vipVisible"
      @cancel="vipCancel"
  />
</template>
<script setup>
import generateAndEncryptToken from "../../util/sort";

const panoid = ref('')
const homeFlag = ref(false)
const webFlag = ref(false)
const webIconFlag = ref(false)
const waterFlag = ref(false)
const LanguageFlag = ref(false)
const dialogVisible = ref(false)
const vip = ref('')
import { onMounted, ref } from 'vue'
import Taro, {useDidShow} from "@tarojs/taro";
import CryptoJS from 'crypto-js';
import './index.scss'
import DialogWorkEncrypt from "../Work/DialogWorkEncrypt.vue";
import DeleteDilaog from "../../components/Dialog/deleteDilaog.vue";
import VipDilaog from "../../components/Dialog/VipDilaog.vue";
useDidShow(() => {
  panoid.value = Taro.getCurrentInstance().router.params.panoid
  vip.value = Taro.getCurrentInstance().router.params.UserVip
  console.log(Taro.getCurrentInstance().router.params,Taro.getCurrentInstance().router.params.UserVip,'Taro.getCurrentInstance().router.params.UserVip')
  getInfo()
})
const vipVisible = ref(false)
const vipCancel = () => {
  vipVisible.value = false
}
const workInfo = ref({})
const getInfo = () => {
  const data = {
    panoid: panoid.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_edit_info',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      workInfo.value = res.data.data
      homeFlag.value = workInfo.value.wantshow === '1'
      webFlag.value = workInfo.value.myshow === '1'
      webIconFlag.value = workInfo.value.isweiicon === '1'
      waterFlag.value = workInfo.value.watermark === '1'
      LanguageFlag.value = workInfo.value.is_language === '2'
      console.log(res.data)
    }
  })
}
const changehomeFlag = (value) => {
  homeFlag.value = value
  moreSet('1', value)
}
const changeWebFlag = (value) => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  webFlag.value = value
  moreSet('2', value)
}
const changeWebIconFlag = (value) => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  webIconFlag.value = value
  moreSet('3', value)
}
const changeWaterFlag = (value) => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  waterFlag.value = value
  moreSet('4', value)
}
const changeLanguageFlag = (value) => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  LanguageFlag.value = value
  moreSet('5', value)
}
const moreSet = (value,open) => {
  const data = {
    type: value,
    panoid: panoid.value,
    is_open: open?'1':'0',
    uesr_token:Taro.getStorageSync('userUid'),

  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.showLoading({
    title: '加载中...',
  })
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_more',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      Taro.hideLoading()
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const deletePano = () => {
  dialogVisible.value = true
}
const deletePanoCancel = () => {
  dialogVisible.value = false
}
const deletePanoConfirm = () => {
  const data = {
    panoid: panoid.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/del_pano',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken,
    },
  }).then((res) => {
    if (res.data.success) {
      // Taro.showToast({
      //   title: '删除成功',
      //   icon: 'success',
      // })
      Taro.switchTab({
        url: `/pages/Home/index`
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
</script>
