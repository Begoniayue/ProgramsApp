<template>
  <view class="index">
    <nut-swiper
      :init-page="2"
      :auto-play="3000"
      pagination-visible
      pagination-color="#6C6BFC"
      pagination-unselected-color="#F6F6F6"
      class="home-swiper"
    >
      <nut-swiper-item v-for="(item, index) in sliderList" :key="index" style="height: 180px">
        <img :src="item.pic" alt="" style="height: 100%; width: 100%" draggable="false" />
      </nut-swiper-item>
    </nut-swiper>
    <!--主体内容-->
    <view class="home-content">
      <view class="home-search-wrap">
        <nut-searchbar v-model="searchValue">
          <template #rightout>  <IconFont name="search"></IconFont> </template>
          <template #rightin>
            <view class="icon" @click="showRight = true">
              <images
                style="width: 24px;height: 24px;background: #fff;"
                src="../../../images/icon.png"
              />
            </view>
          </template>
        </nut-searchbar>
      </view>
      <nut-popup v-model:visible="showRight" position="right" :style="{ width: '40%', height: '100%' }"></nut-popup>
      <view class="back-top">
        <nut-backtop height="calc(100vh - 100px)">
          <template #content>
            <view>
              <nut-tabs v-model="tabValue" class="home-tabs">
                <nut-tab-pane title="VR效果图" pane-key="1" class="list_box">
                  <view class="item">
                    <view class="list">
                      <view class="list_pic" @click="getUrlLink">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt">人体工学沙发</view>
                      <view class="item-description">
                        <view class="item-description-text">
                          艺境高端效果图表现艺境高端效果图表
                        </view>
                        <view class="item-thumb">
                          <icon-font name="fabulous" color="#426543" size="18"></icon-font>
                          <view class="item-count">45689</view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic" @click="getUrlLink">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                  <view class="item">
                    <view class="list">
                      <view class="list_pic">
                        <view class="pic"><image src="../../../images/test.png"/></view>
                      </view>
                      <view class="item_bt"></view>
                    </view>
                  </view>
                </nut-tab-pane>
                <nut-tab-pane title="案例汇报" pane-key="2"> 案例汇报 </nut-tab-pane>
                <nut-tab-pane title="风景航拍" pane-key="3"> 风景航拍 </nut-tab-pane>
                <nut-tab-pane title="项目水电" pane-key="4"> 项目水电 </nut-tab-pane>
              </nut-tabs>
            </view>
          </template>
        </nut-backtop>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro";
/*获取环境变量*/
import { useAppEnvStore } from '../../stores/appEnvStore'
import './index.scss'
import {onMounted, ref} from 'vue';
/*阿里矢量图标库*/
import { IconFont } from '@nutui/icons-vue-taro';
const sliderList = ref([]);
/*轮播*/
const list = ref([
  'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
  'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
  'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
  'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
]);
/*搜索*/
import { Search2 } from '@nutui/icons-vue-taro';
const searchValue = ref('');
/*search*/
const searchInit = (text) => {
  console.log('search', text);
};
const showRight = ref(false);

/**/
const tabValue = ref('1');
const useAppEnv = useAppEnvStore();

onMounted(() => {
  useAppEnv.init()
  getDate()
  console.log(useAppEnv.currentEnv)
})
/*getUrlLink*/
const getUrlLink = () => {
  Taro.navigateTo({
    url: '/pages/Synthesis/index',
  })
};
/* 接口请求*/
const getDate = () =>{
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/banners_new',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data,'1234')
      sliderList.value = res.data.data;
    }
  })
}
/*list*/
const listInit = () => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/index',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data,'13234')
    }
  })
};
</script>
