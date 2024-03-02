<template>
  <view>
    <view class="container">
      <view class="logo">Logo</view>
      <button @click="quickLogin">一键登录</button>
    </view>
<!--   快捷登录 -->
    <input v-model="phoneNumber" type="number" placeholder="请输入手机号" />
    <input v-model="verificationCode" type="number" placeholder="请输入验证码" />
    <button @click="sendVerificationCode">发送验证码</button>
    <button @click="login">登录</button>
  </view>
</template>
<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';

const phoneNumber = ref('');
const verificationCode = ref('');
const quickLogin = async () => {
  try {
    // 调用小程序账号快捷登录接口
    const { code } = await Taro.login();
    const { encryptedData, iv } = await Taro.getUserInfo();

    // 调用后端接口进行快捷登录验证，这里仅作为示例
    const response = await Taro.request({
      url: 'https://your-api-endpoint.com/quick-login',
      method: 'POST',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv,
      },
    });

    const userInfo = response.data;
    console.log('快捷登录成功', userInfo);
    // 快捷登录成功后进行跳转等操作
  } catch (error) {
    console.error('快捷登录失败', error);
  }
};
const sendVerificationCode = () => {
  // 发送验证码逻辑，可以调用后端接口实现
  Taro.request({
    url: 'https://your-api-endpoint.com/sendVerificationCode',
    method: 'POST',
    data: {
      phoneNumber: phoneNumber.value,
    },
    success: (res) => {
      console.log('验证码发送成功：', res.data);
    },
    fail: (error) => {
      console.error('验证码发送失败：', error);
    },
  });
};

const login = () => {
  // 登录逻辑，可以调用后端接口实现
  Taro.request({
    url: 'https://your-api-endpoint.com/login',
    method: 'POST',
    data: {
      phoneNumber: phoneNumber.value,
      verificationCode: verificationCode.value,
    },
    success: (res) => {
      console.log('登录成功：', res.data);
      // 登录成功后可以跳转到其他页面
      Taro.navigateTo({
        url: '/pages/Home/index',
      });
    },
    fail: (error) => {
      console.error('登录失败：', error);
    },
  });
};
</script>
