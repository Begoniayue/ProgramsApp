<template>
  <view>
    <view class="logo">
      <image src="../../../images/logo.svg" mode="aspectFit" />
    </view>
    <view class="title">让设计更容易 为设计师赋能</view>
    <view class="container">
      <nut-tabs v-model="value">
        <nut-tab-pane title="手机号登录" pane-key="1">  <view>
          <nut-form class="login-form">
            <nut-form-item label="+86" prop="phoneNumber">
              <nut-input v-model="formData.phoneNumber" placeholder="请输入手机号" type="text" />
            </nut-form-item>
            <nut-form-item prop="verifyCode">
              <nut-input v-model="formData.verifyCode" placeholder="请输入验证码" type="text" />
              <view class="get-code" @click="getCodeButton">{{ countDown > 0 ? `${countDown}秒后重试` : '获取验证码' }}</view>
            </nut-form-item>
          </nut-form>
          <view class="phone-login" @click="login('phone')">登录</view>
        </view></nut-tab-pane>
        <nut-tab-pane title="账号登录" pane-key="2">
          <nut-form class="login-form">
            <nut-form-item prop="phoneNumber">
              <nut-input v-model="formDataAccount.account" placeholder="用户名/手机号/邮箱" type="text" />
            </nut-form-item>
            <nut-form-item prop="verifyCode">
              <nut-input v-if="showPassword" v-model="formDataAccount.password" placeholder="请输入密码" type="text"/>
              <nut-input v-else v-model="formDataAccount.password" placeholder="请输入密码" type="password"/>
              <view class="get-code" @click="viewPassWord">
                <IconFont name="eye" v-if="showPassword"></IconFont>
                <IconFont name="marshalling" v-else></IconFont>
              </view>
            </nut-form-item>
          </nut-form>
          <view class="phone-login" @click="login('other')">登录</view>
        </nut-tab-pane>
      </nut-tabs>
    </view>
    <view class="quick-argen">
      <nut-checkbox v-model="agreeMentAccount"> 我已阅读并同意<view class="agreement" @click="toAgreeMent">用户协议</view> </nut-checkbox>
    </view>
  </view>
</template>
<script setup>
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { useUserStore } from '../../stores/userStore';
import { IconFont } from '@nutui/icons-vue-taro';
import CryptoJS from 'crypto-js';
const value = ref('1');
const phoneNumber = ref('');
const verificationCode = ref('');
import './index.scss'
import generateAndEncryptToken from "../../util/sort";
const formData = ref({
  phoneNumber: '',
  verifyCode: '',
});
const formDataAccount = ref({
  account: '',
  password: '',
});
const countDown = ref(0); // 新增倒计时状态
const agreeMent = ref(false);
const agreeMentAccount = ref(false);

const login = (type) => {
  if (type === 'phone') {
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
    if (!agreeMentAccount.value) {
      Taro.showToast({ title: '请勾选下方协议', icon: 'none', duration: 2000 });
      return false;
    }
    getSubmitLogin()
  }else {
    if (!formDataAccount.value.account) {
      Taro.showToast({ title: '账号不能为空', icon: 'none', duration: 2000 });
      return false;
    }
    if (!formDataAccount.value.password) {
      Taro.showToast({ title: '密码码不能为空', icon: 'none', duration: 2000 });
      return false;
    }
    if (!agreeMentAccount.value) {
      Taro.showToast({ title: '请勾选下方协议', icon: 'none', duration: 2000 });
      return false;
    }
    // 账号
    toSubmitLogin()
  }
};
const getSubmitLogin = () => {
  // 登录逻辑，可以调用后端接口实现
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/login/phonelogin',
    method: 'GET',
    data: {
      username: formData.value.phoneNumber,
      code: formData.value.verifyCode,
    },
    success: (res) => {
      console.log(res.data.status)
      if (res.data.status === 200){
        const userStore = useUserStore();
        userStore.setUserAndPersist(res.data);
        Taro.setStorageSync('userUid', res.data.data.uid);
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 2000,
        });
        // 登录成功后可以跳转到其他页面
        Taro.switchTab({
          url: '/pages/Home/index'
        });
      }else {
        Taro.showToast({
          title: '账号密码错误',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    fail: (error) => {
      console.error('登录失败：', error);
    },
  });
}
const toSubmitLogin = () => {
  const data = {
    username: formDataAccount.value.account,
    password: CryptoJS.MD5(formDataAccount.value.password).toString(),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  console.log(formDataAccount.value.password,'password')
  // 登录逻辑，可以调用后端接口实现
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/login/loginin',
    method: 'GET',
    data: {
      username: formDataAccount.value.account,
      password: CryptoJS.MD5(formDataAccount.value.password).toString(),
      token:encryptedToken
    },
    success: (res) => {
      console.log(res.data.status)
      if (res.data.status === 200){
        const userStore = useUserStore();
        userStore.setUserAndPersist(res.data);
        Taro.setStorageSync('userUid', res.data.data.uid);
        Taro.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 2000,
        });
        // 登录成功后可以跳转到其他页面
        Taro.switchTab({
          url: '/pages/Home/index'
        });
      }else {
        Taro.showToast({
          title: '账号密码错误',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    fail: (error) => {
      console.error('登录失败：', error);
    },
  });
}
function getCodeButton() {
  if (countDown.value > 0) {
    Taro.showToast({ title: '请稍后重试', icon: 'none', duration: 2000 });
    return;
  }
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
    url: 'https://vr.justeasy.cn/xcx/login/sendValidateCode',
    method: 'GET',
    data: {
      username: formData.value.phoneNumber,
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
const showPassword = ref(false)
const viewPassWord = () => {
  console.log(showPassword.value)
  showPassword.value = !showPassword.value
};
</script>
