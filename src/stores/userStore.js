import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
    }),
    actions: {
        // 更新并持久化用户信息的方法
        async setUserAndPersist(userInfo) {
            console.log('userInfo', userInfo,Taro.getEnv());
            this.userInfo = userInfo;
            // 使用wx.setStorageSync持久化数据
            if (Taro.getEnv()) {
                Taro.setStorageSync('userInfo', JSON.stringify(userInfo));
            }
        },
    },
});