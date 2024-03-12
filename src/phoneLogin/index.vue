<template>
  <view>
    <view class="logo">
      <image src="../../../images/logo.svg" mode="aspectFit" />
    </view>
    <view class="title">让设计更容易 为设计师赋能</view>

<!-- 手机号   -->
    <nut-form class="login-form">
      <nut-form-item label="+86" prop="phoneNumber">
        <nut-input v-model="formData.phoneNumber" placeholder="请输入手机号" type="text" />
      </nut-form-item>
      <nut-form-item prop="verifyCode">
        <nut-input v-model="formData.verifyCode" placeholder="请输入验证码" type="text" />
        <view class="get-code" :disabled="countDown > 0" @click="getCodeButton">{{ countDown > 0 ? `(${countDown})秒后重试` : '获取验证码' }}</view>
      </nut-form-item>
    </nut-form>
    <view class="phone-login" @click="login">登录</view>
<!--  快捷登录  -->
    <view class="quick-title">用其他登录方式</view>
    <view class="container">
      <view class="quick-login" @click="quickLogin">抖音登录</view>
    </view>
    <view class="quick-argen">
      <nut-checkbox v-model="agreeMent"> 我已阅读并同意<view class="agreement" @click="toAgreeMent">用户协议</view> </nut-checkbox>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../stores/userStore';
const phoneNumber = ref('');
const verificationCode = ref('');
import './index.scss'
const formData = ref({
  phoneNumber: '',
  verifyCode: '',
});
const countDown = ref(0); // 新增倒计时状态
const agreeMent = ref(false);
const quickLogin = async () => {
  tt.login({
    success: function(res) {
      const { code } = res;
      console.log('登录返回的code：', code);
        const response = Taro.request({
          url: 'https://vr.justeasy.cn/xcx/login/dylogin',
          method: 'GET',
          data: {
            code: code,
          },
        });
        response.then((res) => {
          const { data, uid } = res;
           Taro.setStorageSync('userUid', uid);
            const userStore = useUserStore();
            userStore.setUserAndPersist(uid);
        })
      // 进行后续处理，例如发送code到服务器进行验证
    },
    fail: function(err) {
      console.error('登录失败：', err);
    }
  });
}

const login = () => {
  if (!formData.value.phoneNumber) {
    Taro.showToast({ title: '手机号不能为空', icon: 'none', duration: 2000 });
    return false;
  }
  if (!/^1[3456789]\d{9}$/.test(formData.value.phoneNumber)) {
    Taro.showToast({ title: '手机号码有误，请重新填写', icon: 'none', duration: 2000 });
    return false;
  }
  if (!formData.value.verifyCode) {
    Taro.showToast({ title: '验证码不能为空', icon: 'none', duration: 2000 });
    return false;
  }
  if (!agreeMent) {
    Taro.showToast({ title: '请勾选下方协议', icon: 'none', duration: 2000 });
    return false;
  }
  getSubmitLogin()
};
const getSubmitLogin = () => {
  // 登录逻辑，可以调用后端接口实现
  Taro.request({
    url: 'https://ai.justeasy.cn/ai/phonelogin',
    method: 'POST',
    data: {
      phoneNumber: phoneNumber.value,
      verificationCode: verificationCode.value,
    },
    success: (res) => {
      console.log('登录成功：', res.data);
      const userStore = useUserStore();
      userStore.setUserAndPersist(res.data);
      Taro.setStorageSync('userUid', res.data.uid);
      Taro.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 2000,
      });
      // 登录成功后可以跳转到其他页面
      Taro.navigateTo({
        url: '/pages/Home/index',
      });
    },
    fail: (error) => {
      console.error('登录失败：', error);
    },
  });
}
function getCodeButton() {
  if (!formData.value.phoneNumber) {
    Taro.showToast({ title: '手机号不能为空', icon: 'none', duration: 2000 });
    return;
  }
  const reg = /^1[3456789]\d{9}$/;
  if (!reg.test(formData.value.phoneNumber)) {
    Taro.showToast({ title: '手机号码有误，请重新填写', icon: 'none', duration: 2000 });
    return;
  }
  getCodeRequest();
}
// 短信发送请求
async function getCodeRequest() {
  Taro.request({
    url: 'https://ai.justeasy.cn/ai/sendcode',
    method: 'POST',
    data: {
      phoneNumber: phoneNumber.value,
    },
    success: (res) => {
      countDown.value = 60;
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
          countDown.value = 0;
        }
      }, 1000);
      console.log('验证码发送成功：', res.data);
    },
    fail: (error) => {
      console.error('验证码发送失败：', error);
    },
  });
}
const toAgreeMent = () => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=https://jeapp.justeasy.cn/index/userPolicy.php?version=137`
  })
};
</script>
