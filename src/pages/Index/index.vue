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
        <view @click="toUrlLink(item.url)">
          <image :src="item.pic" alt="" style="height: 100%; width: 100%" draggable="false" />

        </view>
      </nut-swiper-item>
    </nut-swiper>
    <!--主体内容-->
    <view class="home-content">
      <view class="home-search-wrap">
        <nut-searchbar v-model="searchValue" placeholder="搜索全景关键词" :confirm-type="'search'" @search="listInit">
          <template #rightout>
            <view class="icon" @click="showRight = true">
              <image
                style="width: 24px;height: 24px;"
                src="../../../images/icon.png"
              />
            </view>
          </template>
          <template #rightin>
            <IconFont name="search"></IconFont>
          </template>
        </nut-searchbar>
      </view>
      <nut-popup v-model:visible="showRight" position="right" :style="{ width: '75%', height: '100%' }">
        <view class="check-wrap">
          <view class="check-title">空间分类 </view>
            <nut-radio-group v-model="bigcate" class="home-radio">
              <nut-radio :label="item.id" shape="button" v-for="item in bigcateList" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
            </nut-radio-group>
          <view class="check-title">风格分类 </view>
          <nut-radio-group v-model="smallcate" class="home-radio">
            <nut-radio :label="item.id" shape="button" v-for="item in smallcateList" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
          </nut-radio-group>
        </view>
        <view class="check-btn">
          <nut-button type="primary" @click="Reset" class="reset">重置</nut-button>
          <nut-button type="primary" @click="Sure" class="sure">确定</nut-button>
        </view>
      </nut-popup>
      <view class="scroll-container" @scrolltolower="onReachBottom">
        <nut-backtop height="calc(100vh - 10px)">
          <template #content>
            <view>
              <nut-tabs v-model="tabValue" class="home-tabs" @click="tabClick">
                <nut-tab-pane :title="item.name" :pane-key="item.id" class="list_box" v-for="item in typeList" :key="item.id">
                  <view class="item" v-for="item in dataList" :key="item.id">
                    <view class="list" >
                      <view class="list_pic" @click="getUrlLink(item)">
                        <view class="pic"><image :src="item.preview_url"/></view>
                      </view>
                      <view class="item_bt">{{ item.name }}</view>
                      <view class="item-description">
                        <view class="item-description-text">
                          {{ item.username }}
                        </view>
                        <view class="item-thumb" @click="Collection(item.id)" v-if="item.is_like == 0">
                          <image src="../../../images/tuijian.png" class="item-count-icon"/>
                          <view class="item-count">{{ item.like_num }}</view>
                        </view>
                        <view class="item-thumb" @click="unableCollection()" v-else>
                          <image src="../../../images/tuicolor.png" class="item-count-icon"/>
                          <view class="item-count color">{{ item.like_num }}</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </nut-tab-pane>
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
let type = ref(6);
let bigcate =  ref(0)
let smallcate =  ref(0)
let bigcateList =  ref([])
let smallcateList =  ref([])
let typeList =  ref([])
/*搜索*/
import { Search2 } from '@nutui/icons-vue-taro';
const searchValue = ref('');
const showRight = ref(false);

/**/
const tabValue = ref('6');
const useAppEnv = useAppEnvStore();

onMounted(() => {
  useAppEnv.init()
  getDate()
  siftDate()
})
/*getUrlLink*/
const getUrlLink = (item) => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=${item.work_url}`
  })
};
const toUrlLink = (url) => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=${url}`
  })
};
/* 接口请求*/
const getDate = () =>{
  return Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/banners_new',
    method: 'GET',
    header: {
      "content-type":"application/x-www-form-urlencoded"
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      sliderList.value = res.data.data;
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
// 加载更多数据
const listInit = async (pageNumber) => {
  Taro.showLoading({
    title: '加载中...',
  });
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/index',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      page: page.value,
      type:type.value,
      smallcate:smallcate.value,
      bigcate:bigcate.value,
      keywords:searchValue.value,
      uesr_token:Taro.getStorageSync('userUid'),
      token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString(),
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      dataList.value = res.data.data.list;
      Taro.hideLoading();
    } else {
      throw new Error('Failed to fetch data');
    }
  });
};
import CryptoJS from 'crypto-js';
const loadMoreData = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    const data = await listInit(page.value);
    // dataList.value = [...dataList.value, ...data];
    page.value++;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
/*筛选*/
const siftDate = () =>{
  return Taro.request({
    url: 'https://vr.justeasy.cn/Xcx/pano/get_cate',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      bigcateList.value = res.data.data.bigcate;
      smallcateList.value = res.data.data.smallcate;
      typeList.value = res.data.data.type;
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
// 在组件挂载后首次加载或监听滚动到底部事件来调用 loadMoreData 方法
onMounted(() => {
  loadMoreData();
});
const refreshData = async () => {
  // 重新初始化数据，这里简单起见，你需要替换为真实的刷新逻辑
  page = 1;
  await listInit(1)
};
const Reset = () => {
  bigcate.value = 0;
  smallcate.value = 0;
};
const Sure = () => {
  console.log('确定')
  showRight.value = false;
  page.value = 1
  listInit()
};
const Collection = (id) => {
  if(Taro.getStorageSync('userUid') ==null){
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
  }
  Taro.request({
    url: ' https://vr.justeasy.cn/xcx/pano/set_like',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      pano_id: id,
      token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString(),
      uesr_token:Taro.getStorageSync('userUid')
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      listInit()
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
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
const tabClick = (e) => {
  type.value = Number(e.paneKey)
  page.value = 1
  listInit()
}
const unableCollection = () => {
  Taro.showToast({
    title: '赞过啦',
  })
}
/*作品加密*/
const dialogVisibleWorkEncrypt = ref(false)
const openWorkEncryptDialog = () => {
  dialogVisibleWorkEncrypt.value = true
}
</script>
