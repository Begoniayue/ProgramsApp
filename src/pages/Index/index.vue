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
      <nut-swiper-item v-for="(item, index) in sliderList" :key="Index" style="height: 180px">
        <img :src="item.pic" alt="" style="height: 100%; width: 100%" draggable="false" />
      </nut-swiper-item>
    </nut-swiper>
    <!--主体内容-->
    <view class="home-content">
      <view class="home-search-wrap">
        <nut-searchbar v-model="searchValue">
          <template #rightout>
            <view class="icon" @click="showRight = true">
              <image
                style="width: 24px;height: 24px;"
                src="../../../images/icon.png"
              />
            </view>
          </template>
          <template #rightin>  <IconFont name="search"></IconFont> </template>
        </nut-searchbar>
      </view>
      <nut-popup v-model:visible="showRight" position="right" :style="{ width: '40%', height: '100%' }"></nut-popup>
      <view class="scroll-container" @scrolltolower="onReachBottom">
        <nut-backtop height="calc(100vh - 10px)">
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
                          <image src="../../../images/tuijian.png" class="item-count-icon"/>
                          <view class="item-count">45689</view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <div v-if="loading" class="loading">加载中...</div>
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
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { getSlider } from '../../service/home';
/*获取环境变量*/
import { useAppEnvStore } from '../../stores/appEnvStore'
import './index.scss'
import { ref, onMounted, } from 'vue';
/*阿里矢量图标库*/
import { IconFont } from '@nutui/icons-vue-taro';
const sliderList = ref([]);
const dataList = ref([]);
const loading = ref(false);
let page = ref(1);
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
  // getDate()
  // loadMoreData()
})
/*getUrlLink*/
const getUrlLink = () => {
  Taro.navigateTo({
    url: '/pages/Synthesis/index',
  })
};
/* 接口请求*/
const getDate = () =>{
  getSlider()
    .then((res) => {
      sliderList.value = res.data.data;
      console.log(res);
    })
    .catch((error) => {
      // 处理请求错误
      console.error(error);
    });
}
// 加载更多数据
const listInit = async (pageNumber) => {
  // 实际的 API 请求逻辑
  return Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/index',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return res.data;
    } else {
      throw new Error('Failed to fetch data');
    }
  });
};

const loadMoreData = async () => {
  if (loading.value) return;

  try {
    loading.value = true;
    const data = await listInit(page.value);
    dataList.value = [...dataList.value, ...data];
    page.value++;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 在组件挂载后首次加载或监听滚动到底部事件来调用 loadMoreData 方法
onMounted(() => {
  loadMoreData();
});
const refreshData = async () => {
  // 重新初始化数据，这里简单起见，你需要替换为真实的刷新逻辑
  page = 1;
  await listInit(1)
};
const onReachBottom = () => {
  console.log('触底啦！加载更多数据');
  loadMoreData()
};
// // 监听页面滚动事件，触发加载更多数据
useReachBottom(() => {
  console.log('触底啦！加载更多数据');
  loadMoreData()
});
//
// // 监听下拉刷新事件，触发刷新数据
usePullDownRefresh(() => {
  console.log('onPullDownRefresh')
  // refreshData()
})

</script>
