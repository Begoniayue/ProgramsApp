<template>
  <view class="home-checkbox">
    <view class="opeation" v-if="toggle">
      <view class="check-box" @click="toggleAll(true)">全选</view>
      <view v-if="state.length" class="opeation-right">
        <view class="item" @click="delVisible = true">删除&nbsp;&nbsp;|</view>
        <view class="item" @click="getSift">移动&nbsp;&nbsp;</view>
      </view>
    </view>
    <view class="opeation" v-else>
      <view class="item" @click="toggleAll(false)">取消全选&nbsp;&nbsp;|</view>
      <view class="item" @click="delVisible = true">删除&nbsp;&nbsp;|</view>
      <view class="item" @click="getSift">移动&nbsp;&nbsp;</view>
    </view>
    <nut-checkbox-group ref="group" v-model="state">
      <nut-checkbox v-for="item in dataList" :key="item.pano_id" :label="item.pano_id">
        <view class="item-list">
          <view class="left-container">
            <image :src="item.preview" mode="aspectFit" class="image"></image>
          </view>
          <view class="right-container">
            <view class="info-line">
              <view class="work-title">{{ item.name }}</view>
            </view>
            <view class="info-line">
              <view class="date">{{ item.addtime }}</view>
            </view>
          </view>
        </view>
      </nut-checkbox>
    </nut-checkbox-group>
    <nut-dialog v-model:visible="showSift" title="移动至新分组" @ok="SiftonOk" class="sift-dailog">
      <view class="check-wrap">
        <nut-radio-group v-model="groupid" class="home-radio">
          <nut-radio v-for="item in siftList" :label="item.groupid" shape="button" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
        </nut-radio-group>
      </view>
    </nut-dialog>
<!--    -->
    <nut-dialog
        title="确定要删除吗"
        v-model:visible="delVisible"
        @ok="delOk"
    >
      会员删除作品将在回收站保留30天，非会员保留15天
    </nut-dialog>
  </view>
</template>
<script setup>
import './index.scss'
import { onMounted, ref } from 'vue'
import Taro, {useDidShow} from "@tarojs/taro";
import CryptoJS from 'crypto-js';
import generateAndEncryptToken from "../../util/sort";
const state = ref([])
const dataList = ref([])
const type = ref('')
const page = ref(1);
const page_size = ref(30);
const groupid = ref('0')
const sort = ref('0')
const group = ref(null);
const toggle = ref(true)
const showSift = ref(false)
const delVisible = ref(false)
useDidShow(() => {
  type.value = Taro.getCurrentInstance().router.params.type
  getList()
  console.log(dataList.value)
})
const getList = () => {
  const data = {
    page: page.value,
    page_size: page_size.value,
    groupid: groupid.value,
    sort: sort.value,
    type: type.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  console.log('getList')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_my_pano_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      dataList.value = res.data.data;
      console.log('dataList', dataList.value)
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const toggleAll = (f) => {
  toggle.value = !toggle.value
  group.value.toggleAll(f);
};
const siftList = ref([])
const getSift = () => {
  const data = {
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_group',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uesr_token:Taro.getStorageSync('userUid'),
    token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      siftList.value = res.data.data;
      showSift.value = true
    }
  })
}
const SiftonOk = () => {
  const data = {
    group_id:groupid.value,
    ids: state.value.join(','),
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/move_batch',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
    ...data,
    token: encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      state.value = []
      group.value = '';
      toggle.value = true
      Taro.showToast({
        title: '移动成功',
      });
      // getList()
    }
  })
};
const delOk = () => {
  const data = {
    ids: state.value.join(','),
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/del_batch',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token:encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      getList()
    }
  })
}
</script>
