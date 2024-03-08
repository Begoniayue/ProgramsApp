<template>
  <view class="container">
    <button @click="playAudio">播放声音</button>
  </view>
  <view>
    <button @click="completeAndBack">保存</button>
  </view>
  <view class="content">
    <nut-tabs style="height: 100vh" v-model="state.tab5value" title-scroll direction="vertical">
      <nut-tab-pane v-for="item in state.list5" :title="'Tab'+ item" :pane-key="item" :key="item"/>
    </nut-tabs>
    <scroll-view style="height: 100vh;flex: 1" scroll-y="true">
      <view class="list-content">
        <nut-radio-group v-model="BGMSelected">
          <view v-for="item in state.count" :key="item" class="list-item">
            <view class="play-or-pause" @click="playId = ''" v-if="playId === item">暂停</view>
            <view class="play-or-pause" @click="playId = item" v-else>播放</view>
            {{ item }}
            <nut-radio :label="item" class="radio-content"/>
          </view>
        </nut-radio-group>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro';
import {reactive, ref} from 'vue';

const state = reactive({
  tab5value: '0',
  list5: Array.from(new Array(2).keys()),
  count: Array.from(new Array(100).keys())

});
const BGMSelected = ref('1');
const playId = ref()
const playAudio = () => {
  // 创建音频上下文
  const audioContext = Taro.createInnerAudioContext();

  // 设置音频源
  audioContext.src = 'https://example.com/audio.mp3';

  // 播放音频
  audioContext.play();

  // 监听音频播放结束事件
  audioContext.onEnded(() => {
    console.log('音频播放结束');
    // 可以在这里执行一些操作，例如停止播放等
    // audioContext.stop();
  });
};
const completeAndBack = () => {
  // 返回到原页面，并携带值
  Taro.navigateBack({
    delta: 1,  // 返回到原页面，如果有多级页面，可能需要调整 delta 的值
  })
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
