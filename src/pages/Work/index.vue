<template>
  <view>
    <nut-cell-group>
      <nut-cell title="作品加密" :round-radius="0" :desc="workInfo.pwd_value === '0'? '暂未开启':'当前密码：' + workInfo.pwd_value" is-link @click="openWorkEncryptDialog">
        <template #title>
          <view style="position: relative">
            作品加密
            <view class="vip-icon" v-if="vip === '0'">
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
          </view>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>
      <nut-cell title="作品标题" round-radius="0" :desc=workInfo.name is-link @click="openEditWorkTitleDialog"/>
      <nut-cell title="全景作者" round-radius="0" :desc="workInfo.author" is-link @click="openEditWorkAuthorDialog"/>
      <nut-cell title="设计说明" round-radius="0" :desc="workInfo.intro" is-link @click="openEditDesignDescDialog"/>
      <nut-cell title="编辑背景音乐" round-radius="0" :desc="workInfo.music_name" is-link @click="toSetBGM"/>
      <nut-cell round-radius="0" :desc="logo ? '':'*建议不小于150*150像素'" is-link @click="uploadImage">
        <template #title>
          <view style="position: relative">
            作品logo
            <view class="vip-icon" v-if="vip === '0'">
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
            <view class="logo-image" v-if="logo">
              <image :src="'https://vrimg.justeasy.cn/' + logo" mode="aspectFit"></image>
            </view>
          </view>
        </template>
      </nut-cell>
      <nut-cell round-radius="0" :desc="water ? '':'*建议200*50的PNG图片'"  is-link @click="uploadWater">
        <template #title>
          <view style="position: relative">
            作品水印
            <view class="vip-icon" v-if="vip === '0'">
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
            <view class="logo-image" v-if="water">
              <image :src="'https://vrimg.justeasy.cn/' + water"  mode="aspectFit"></image>
            </view>
          </view>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>
      <nut-cell title="浏览量" round-radius="0">
        <template #link>
          <nut-switch :model-value="viewCountFlag" @change="changeViewCountFlag" active-color="#6C6BFC"/>
        </template>
      </nut-cell>
      <nut-cell title="点赞" round-radius="0">
        <template #link>
          <nut-switch :model-value="likeFlag" @change="changeLikeFlag" active-color="#6C6BFC"/>
        </template>
      </nut-cell>
      <nut-cell title="展示场景预览图" round-radius="0">
        <template #link>
          <nut-switch :model-value="showPreviewFlag" @change="changeShowPreviewFlag" active-color="#6C6BFC"/>
        </template>
      </nut-cell>
      <nut-cell title="小行星开场" round-radius="0">
        <template #link>
          <nut-switch :model-value="showAsteroidFlag" @change="changeShowAsteroidFlag" active-color="#6C6BFC"/>
        </template>
      </nut-cell>
      <nut-cell round-radius="0">
        <template #title>
          <view style="position: relative">
            自动旋转
            <view style="position: absolute; right: 5px;top: -5px" v-if="showRotateFlag">
              <nut-radio-group v-model="autoSpeed" direction="horizontal" :icon-size="12" class="home-radio" @change="moreSet">
                <nut-radio shape="button" label="12">快速</nut-radio>
                <nut-radio shape="button" label="8">中速</nut-radio>
                <nut-radio shape="button" label="6">慢速</nut-radio>
              </nut-radio-group>
            </view>
            <view style="position: absolute; right: 5px;top: -5px" v-else>
              <nut-radio-group v-model="showRotateFlag" direction="horizontal" :icon-size="12" class="home-radio">
                <nut-radio shape="button" label="3">快速</nut-radio>
                <nut-radio shape="button" label="2">中速</nut-radio>
                <nut-radio shape="button" label="1">慢速</nut-radio>
              </nut-radio-group>
            </view>
          </view>
        </template>
        <template #link>
          <nut-switch :model-value="showRotateFlag" @change="changeShowRotateFlag" active-color="#6C6BFC"/>
        </template>
      </nut-cell>
    </nut-cell-group>
    <DialogWorkEncrypt
      :dialogVisible="dialogVisibleWorkEncrypt"
      @cancel="onWorkEncryptDialogCancel"
      @ok="onWorkEncryptDialogOk"
      :password="workInfo.pwd_value"
      :encryptFlag="workInfo.pwd_value"
    />
    <DialogWorkTitle
      :dialogVisible="dialogVisibleWorkTitle"
      @cancel="onWorkTitleDialogCancel"
      @ok="onWorkTitleDialogOk"
      :title="title"
    />
    <DialogWorkAuthor
      :dialogVisible="dialogVisibleWorkAuthor"
      @cancel="onWorkAuthorDialogCancel"
      @ok="onWorkAuthorDialogOk"
      :text="workInfo.author"
    />
    <DialogDesignDesc
      :dialogVisible="dialogVisibleDesignDesc"
      @cancel="onDesignDescDialogCancel"
      @ok="onDesignDescDialogOk"
      :text="workInfo.intro"
    />
    <VipDilaog
      :dialogVisible="vipVisible"
      @cancel="vipCancel"
    />
  </view>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import Taro, {useDidShow} from "@tarojs/taro";
import './index.scss'
import DialogWorkEncrypt from './DialogWorkEncrypt.vue'
import DialogWorkTitle from './DialogWorkTitle.vue'
import DialogWorkAuthor from './DialogWorkAuthor.vue'
import DialogDesignDesc from "./DialogDesignDesc.vue";
import CryptoJS from 'crypto-js';
import VipDilaog from "../../components/Dialog/VipDilaog.vue";
import generateAndEncryptToken from "../../util/sort";
const password = ref('')
const vipVisible = ref(false)
const title = ref('')
const author = ref('')
const intro = ref('')
const water = ref('')
const avatar = ref('')
const logo = ref('')
// ----------------------作品加密---------------------
const dialogVisibleWorkEncrypt = ref(false)
const openWorkEncryptDialog = () => {
  if (vip.value === '0'){
    vipVisible.value = true
  }else {
    dialogVisibleWorkEncrypt.value = true
  }
}
const onWorkEncryptDialogCancel = () => {
  dialogVisibleWorkEncrypt.value = false
}
const panoid = ref('')
const vip = ref('')
useDidShow(()=>{
  panoid.value = Taro.getCurrentInstance().router.params.panoid
  vip.value = Taro.getCurrentInstance().router.params.UserVip
})
const sessionid = ref('')
const getUid = () => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_uid',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data:{
      user_token:Taro.getStorageSync('userUid')
    }
  }).then((res) => {
    if (res.data.status === 200) {
      sessionid.value = res.data.data
    }
  })
}
const workInfo = ref({})
const autoSpeed = ref(-1)
const getInfo = () => {
  const data = {
    panoid: panoid.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_edit_info',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      workInfo.value = res.data.data
      water.value = workInfo.value.water
      logo.value = workInfo.value.avatar
      title.value = workInfo.value.name
      autoSpeed.value = workInfo.value.auto_speed
      viewCountFlag.value = workInfo.value.is_view === '1'
      likeFlag.value = workInfo.value.is_like === '1'
      showPreviewFlag.value = workInfo.value.showthumbs === '1'
      showAsteroidFlag.value = workInfo.value.is_planet === '1'
      showRotateFlag.value = workInfo.value.is_auto === '1'
      console.log(res.data,title.value,'title.value',autoSpeed.value)
    }
  })
}
const onWorkEncryptDialogOk = (val,currentEncryptFlag) => {
  const data = {
    panoid: panoid.value,
    is_encrypt:currentEncryptFlag,
    pwd: val,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.showLoading({
    title: '加载中...',
  })
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pwd',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    console.log(res.data.status)
    if (res.data.status === 200) {
     Taro.hideLoading()
      getInfo()
    } else {
      Taro.showToast({
        title:res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  });
  console.log(val)
}
// ----------------------作品标题---------------------
const dialogVisibleWorkTitle = ref(false)
const openEditWorkTitleDialog = () => {
  dialogVisibleWorkTitle.value = true
}
const onWorkTitleDialogCancel = () => {
  dialogVisibleWorkTitle.value = false
}

const onWorkTitleDialogOk = (val) => {
  workInfo.value.name = val
  title.value = val
  changeInfo()
  console.log(val)
}
// ----------------------作品作者---------------------
const dialogVisibleWorkAuthor = ref(false)
const openEditWorkAuthorDialog = () => {
  dialogVisibleWorkAuthor.value = true
}
const onWorkAuthorDialogCancel = () => {
  dialogVisibleWorkAuthor.value = false
}
const onWorkAuthorDialogOk = (val) => {
  workInfo.value.author = val
  changeInfo()
}
// ----------------------设计说明---------------------
const dialogVisibleDesignDesc = ref(false)
const openEditDesignDescDialog = () => {
  dialogVisibleDesignDesc.value = true
}
const onDesignDescDialogCancel = () => {
  dialogVisibleDesignDesc.value = false
}
const vipCancel = () => {
  vipVisible.value = false
}
const onDesignDescDialogOk = (val) => {
  workInfo.value.intro = val
  changeInfo()
}
// ----------------------背景音乐---------------------
const toSetBGM = () => {
  Taro.navigateTo({
    url: `/pages/BGMSet/index?panoid=${panoid.value}`,
  })
}
// ----------------------浏览量-----------------------
const viewCountFlag = ref()
const changeViewCountFlag = (value) => {
  console.log('changeViewCountFlag', value)
  viewCountFlag.value = value
  type.value = '6'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------点赞------------------------
const likeFlag = ref()
const changeLikeFlag = (value) => {
  console.log('changeLikeFlag', value)
  likeFlag.value = value
  type.value = '7'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------展示场景预览图----------------
const showPreviewFlag = ref()
const changeShowPreviewFlag = (value) => {
  console.log('changeShowPreviewFlag', value)
  showPreviewFlag.value = value
  type.value = '8'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------小行星开场-------------------
const showAsteroidFlag = ref()
const changeShowAsteroidFlag = (value) => {
  console.log('changeShowAsteroidFlag', value)
  showAsteroidFlag.value = value
  type.value = '9'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------自动旋转---------------------
const showRotateFlag = ref()
const changeShowRotateFlag = (value) => {
  showRotateFlag.value = value
  console.log('changeShowRotateFlag', value,showRotateFlag.value)
  if (showRotateFlag.value) {
    // autoSpeed.value = '1'
  }
  type.value = '10'
  is_open.value = value ? '1' : '0'
  moreSet()
}
const rotateSpeed = ref('1')
const changeInfo = (value) => {
  const data = {
    panoid: panoid.value,
    name:workInfo.value.name,
    author: workInfo.value.author,
    intro: workInfo.value.intro,
    water: water.value,
    avatar: logo.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pano_info',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token:encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      Taro.showToast({
        title: '成功',
        icon: 'success',
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const type = ref('1')
const speed = rotateSpeed.value
const is_open = ref('1')
const moreSet = (value) => {
  console.log('moreSet', workInfo.value.auto_speed)
  const data = {
    type: type.value,
    panoid: panoid.value,
    speed:autoSpeed.value,
    is_open: is_open.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_more',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      // Taro.showToast({
      //   title: '成功',
      //   icon: 'success',
      // })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}

const uploadImage = async () => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  Taro.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(res)
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths)
      Taro.uploadFile({
        url: 'https://vr.justeasy.cn/User/Upload/imagecut.php?act=logo', // 上传的地址
        filePath: tempFilePaths[0],
        name:'file',
        formData:{
          sessionid: sessionid.value,
        },
        success(res) {
          console.log(res.data)
          let dataStr = res.data.trim(); // 去除字符串前后空白字符
          if (dataStr.startsWith('\uFEFF')) {
            dataStr = dataStr.substring(1); // 移除BOM字符
          }
          let data;
          data = JSON.parse(dataStr);
          if (data.status === 200){
            logo.value = data.filename
            console.log(logo.value)
            setTimeout(()=>{
              changeInfo()
            },3000)
          }else {
            Taro.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
          }
        },
        fail(err) {
          Taro.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
          console.error('上传失败：', err)
        }
      })
    }
  })
};
const uploadWater = async () => {
  if (vip.value === '0'){
    vipVisible.value = true
    return
  }
  Taro.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths;
      Taro.uploadFile({
        url: 'https://vr.justeasy.cn/user/upload/water', // 上传的地址
        filePath: tempFilePaths[0],
        name:'file',
        formData:{
          sessionid: sessionid.value,
        },
        success(res) {
          let dataStr = res.data.trim(); // 去除字符串前后空白字符
          if (dataStr.startsWith('\uFEFF')) {
            dataStr = dataStr.substring(1); // 移除BOM字符
          }
          let data;
          data = JSON.parse(dataStr);
          if (data.status === 200){
            water.value = data.url
            console.log(logo.value)
            Taro.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
            setTimeout(()=>{
              changeInfo()
            },3000)
          }else {
            Taro.showToast({
              title: '非会员不可自定义水印',
              icon: 'error',
              duration: 2000
            })
          }
        },
        fail(err) {
          Taro.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 2000
          })
          console.error('上传失败：', err)
        }
      })
    }
  })
};

useDidShow(() => {
  getInfo()
})
onMounted(()=>{
  getUid()
})
</script>
