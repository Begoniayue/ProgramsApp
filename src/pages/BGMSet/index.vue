<template>
  <view @click="completeAndBack"  class="share-text">保存</view>
  <view class="content">
    <nut-tabs v-model="state.tabvalue" title-scroll title-gutter="10" name="tabName" direction="vertical">
      <nut-tab-pane  v-for="item in musicList" :title="item.cate_name" :pane-key="item.cate_id" :key="item" >
        <scroll-view style="height: 100vh;flex: 1" scroll-y="true">
          <view class="list-content">
            <nut-radio-group v-model="BGMSelected" text-position="left">
              <view   v-for="music in item.music_list" :key="music.music_name">
                <nut-radio :label="music.music_url">
                  <!--                -->
                  <view @click="playAudio(music.music_url)">
                    <IconFont name="play-start"  color="#6C6BFC"></IconFont>
                    {{ music.music_name }}
                  </view>
                  <template #icon></template>
                  <template #checkedIcon> <IconFont name="checked"  color="#6C6BFC"></IconFont></template>
                </nut-radio>
              </view>
            </nut-radio-group>
          </view>
        </scroll-view>
      </nut-tab-pane>
    </nut-tabs>
    <nut-tabs style="height: 100vh" v-model="state.tabvalue" title-scroll direction="vertical">
      <nut-tab-pane v-for="item in musicList" :title="item.cate_name" :pane-key="item.cate_id" :key="item.cate_id"/>
    </nut-tabs>

  </view>
</template>

<script setup>
import Taro, {useDidShow} from '@tarojs/taro';
import './index.scss'
import {onMounted, reactive, ref} from 'vue';
import {IconFont} from "@nutui/icons-vue-taro";

const state = reactive({
  tabvalue: '589',
  list5: Array.from(new Array(2).keys()),
  count: Array.from(new Array(100).keys())
});
const BGMSelected = ref('');
const playId = ref()
const playAudio = (url) => {
  console.log(url)
  // 创建音频上下文
  const audioContext = Taro.createInnerAudioContext();

  // 设置音频源
  audioContext.src = url;

  // 播放音频
  audioContext.play();

  // 监听音频播放结束事件
  audioContext.onEnded(() => {
    console.log('音频播放结束');
    // 可以在这里执行一些操作，例如停止播放等
    audioContext.stop();
  });
};
import CryptoJS from 'crypto-js';
import generateAndEncryptToken from "../../util/sort";
const completeAndBack = () => {
  const data = {
    panoid: panoid.value,
    music_url: BGMSelected.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_music',
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
      // 返回到原页面，并携带值
      Taro.navigateBack({
        delta: 1,  // 返回到原页面，如果有多级页面，可能需要调整 delta 的值
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const panoid = ref('')
useDidShow(()=>{
  panoid.value = Taro.getCurrentInstance().router.params.panoid
  getList()
})
const musicList = ref([])
const getList = () => {
  const data = {
    panoid: panoid.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_music_list',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      musicList.value = res.data.data
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
