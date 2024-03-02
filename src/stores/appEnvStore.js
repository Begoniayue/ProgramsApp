
import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
export const useAppEnvStore = defineStore('appEnv', {
  state: () => ({
    currentEnv: ''
  }),
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async init() {
      // 在这里获取当前环境并赋值给state
      this.currentEnv = Taro.getEnv()
    }
  }
})

/*存储token*/

export const appToken = defineStore('appToken', {
  state: () => ({
    token: ''
  }),
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async init() {
      // 在这里获取当前环境并赋值
      // this.token =
    }
  }
})

/*  存储用户信息*/
export const appUserInfo = defineStore('appUserInfo', {
  state: () => ({
    userInfo: {}
  }),
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    async init() {
      // 在这里获取当前环境并赋值
      this.userInfo = Taro.getStorageSync('userInfo')
    }
  }
})
