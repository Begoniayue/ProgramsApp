
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

