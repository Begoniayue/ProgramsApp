<template>
  <view class="container">
    <button @click="playAudio">播放声音</button>
  </view>
  <view>
    <button @click="navigateToDetail">跳转到详情页</button>
    <button @click="completeAndBack">完成并返回</button>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro';

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
const navigateToDetail = () => {
  // 通过 Taro.navigateTo 传递参数
  Taro.navigateTo({
    url: '/pages/detail/index?param1=value1&param2=value2',
  });
};
const completeAndBack = () => {
  // 假设这里有一个操作，你可以在这里获取需要传递的值
  const resultData = {
    param1: 'new value1',
    param2: 'new value2',
  };

  // 返回到原页面，并携带值
  Taro.navigateBack({
    delta: 1,  // 返回到原页面，如果有多级页面，可能需要调整 delta 的值
    success: function () {
      const pages = Taro.getCurrentPages();
      const prevPage = pages[pages.length - 2];  // 获取原页面实例

      // 通过 Taro 对象的事件监听方式将值传递到原页面
      Taro.eventCenter.trigger('updateFormData', resultData);
    },
  });
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
