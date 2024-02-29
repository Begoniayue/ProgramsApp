<template>
  <view class="home-content">
    <view class="home-top-wrap">
      <view class="user-info-container">
        <view class="avatar-container">
          <image src="https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif" class="avatar-img"/>
        </view>
        <view class="info-container">
          <view class="user-info" v-if="vip">
           <view class="user-name">我是用户昵称…我是用户昵称…我是用户昵称…</view>
           <view class="vip-icon"><image src="../../../images/vip.png" /></view>
           <view class="vip-date">(会员到期：2024-09-30)</view>
          </view>
          <view class="user-info" v-else>
            <view class="user-name">我是用户昵称…我是用户昵称…我是用户昵称…</view>
            <view class="open-vip">开通全景VIP</view>
          </view>
          <!-- 其他用户信息 -->
          <div class="work-capacity">
            <view class="work-text">作品容量：</view>
            <view class="work-count">
              <view class="work-count-text">1400</view>
              <view class="work-count-total">/3000</view>
              <view class="work-icon" @click="openTips"> <image src="../../../images/ask.png" /></view>
            </view>
          </div>
          <nut-popup v-model:visible="showTips" position="bottom" closeable :style="{ height: '30%' }"></nut-popup>
          <!-- 进度条 -->
          <nut-progress
            stroke-color="linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(32,147,255,1) 32.815625%,rgba(13,242,204,1) 100%)"
            :percentage="30"
            :show-text="false"
            status="active"
            class="progress"
          />
        </view>
      </view>

    </view>
    <view class="home-web-wrap">
      <image src="../../../images/web.png"></image>
      <view class="web-btn">点击了解</view>
    </view>
    <!--选项-->
    <view>
<!-- 搜索     -->
      <nut-tabs v-model="tabValue" class="home-tabs">
        <nut-tab-pane title="全景图" pane-key="1" class="list-box">
          <nut-searchbar v-model="val">
            <template #rightout> Search </template>
            <template #rightin>
              <Search2 />
            </template>
          </nut-searchbar>
          <view class="item">
            <view class="item-list">
              <view class="left-container">
                <image src="../../../images/thumb.jpg" mode="aspectFit" class="image"></image>
              </view>
              <view class="right-container">
                <view class="info-line">
                  <view class="work-title">作品名称</view>
                  <button class="share-text" open-type="share" @click="shareLink">分享</button>
                </view>
                <view class="info-line">
                  <text class="date">2021-09-27 13:12</text>
                </view>
                <view class="info-line">
                  <view class="vide-wrap">
                    <image src="../../../images/video.png" mode="aspectFit" class="icon"></image>
                    <view class="text">生成短视频</view>
                  </view>
                  <view>
                    <image class="icon" src="../../../images/set.png"></image>
                    <image class="icon" src="../../../images/gengduo.png"></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="平面图" pane-key="2"> 案例汇报 </nut-tab-pane>
        <nut-tab-pane title="预约信息" pane-key="3"> 预约信息 </nut-tab-pane>
        <nut-tab-pane title="素材库" pane-key="4"> 素材库 </nut-tab-pane>
        <nut-tab-pane title="素材库" pane-key="5"> 回收站 </nut-tab-pane>
      </nut-tabs>
    </view>
  </view>
</template>
<script setup>
import { Taro } from '@tarojs/taro';
import { ref } from 'vue';
import './index.scss'
import { useShareAppMessage } from '@tarojs/taro'
import {IconFont} from "@nutui/icons-vue-taro";
import { usePageEvent } from '@tarojs/taro';
const showTips = ref(false);
const vip = ref(false)
const tabValue = ref('1');
import { Search2 } from '@nutui/icons-vue-taro';
const val = ref('');
const url = ref('https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png');
const openTips = () => {
  console.log('showTips')
  showTips.value = true;
};
const shareLink = () => {
  console.log('shareLink')
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '我的分享标题',
        path: '/pages/index/index',
        imageUrl: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
        success() {
          // 分享成功后的回调处理
        },
        fail(err) {
          // 分享失败后的回调处理
        },
      };
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
    }
  })
};
</script>
