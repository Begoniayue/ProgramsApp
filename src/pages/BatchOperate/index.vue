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
          <nut-radio :label="item.groupid" shape="button" v-for="item in siftList" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
        </nut-radio-group>
      </view>
    </nut-dialog>
<!--    -->
    <nut-dialog
        title="确定要删除吗"
        v-model:visible="delVisible"
        @ok="delOk"
    >
      删除后作品可在回收站保留15日会员可保留30日
    </nut-dialog>
    <nut-dialog
        title="回收站密码"
        v-model:visible="referVisible"
        @cancel="onOk"
        @ok="onCancel"
    >
      <view>
        <nut-radio-group v-model="passwordFlag" direction="horizontal">
          <nut-radio label="1">开启</nut-radio>
          <nut-radio label="2">关闭</nut-radio>
        </nut-radio-group>
        <nut-input v-if="passwordFlag=== '1'" v-model="password" placeholder="请输入加密密码"/>
      </view>
    </nut-dialog>
  </view>
</template>
<script setup>
import './index.scss'
import { onMounted, ref } from 'vue'
import Taro  from "@tarojs/taro";
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
onMounted(() => {
  type.value = Taro.getCurrentInstance().router.params.type
  getList()
  console.log(dataList.value)
})
const getList = () => {
  console.log('getList')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_my_pano_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      page: page.value,
      page_size: page_size.value,
      groupid: groupid.value,
      sort: sort.value,
      type: type.value,
      uesr_token:Taro.getStorageSync('userUid'),
      token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString()
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
  console.log('getSift')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_group',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
          uesr_token:Taro.getStorageSync('userUid'),
    token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString()
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      siftList.value = res.data.data;
      showSift.value = true
    }
  })
}
const SiftonOk = () => {
  Taro.request({
    url: ' https://vr.justeasy.cn/xcx/pano/move_batch',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ids: state.value.join(','),
          uesr_token:Taro.getStorageSync('userUid'),
    token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString(),
      group_id:groupid.value
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      state.value = []
      group.value = '';
      getList()
    }
  })
};
const delOk = () => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/del_batch',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ids: state.value.join(','),
          uesr_token:Taro.getStorageSync('userUid'),
    token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString()
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      getList()
    }
  })
}
</script>
