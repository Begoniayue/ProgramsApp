<template>
  <view>
    <nut-cell-group>
      <nut-cell title="作品加密" round-radius="0" desc="当前密码" is-link @click="openWorkEncryptDialog"/>
    </nut-cell-group>
    <nut-cell-group>
      <nut-cell title="作品标题" round-radius="0" :desc=title is-link @click="openEditWorkTitleDialog"/>
      <nut-cell title="全景作者" round-radius="0" :desc="author" is-link @click="openEditWorkAuthorDialog"/>
      <nut-cell title="设计说明" round-radius="0" desc="设计说明" is-link @click="openEditDesignDescDialog"/>
      <nut-cell title="编辑背景音乐" round-radius="0" desc="music" is-link @click="toSetBGM"/>
      <nut-cell round-radius="0" is-link @click="uploadImage">
        <template #title>
          <view style="position: relative">
            作品logo
            <view style="position: absolute; right: 5px;top: 0">
              图片
            </view>
          </view>
        </template>
      </nut-cell>
      <nut-cell round-radius="0" is-link>
        <template #title>
          <view style="position: relative">
            作品水印
            <view style="position: absolute; right: 5px;top: 0">
              图片
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
            <view style="position: absolute; right: 5px;top: -5px">
              <nut-radio-group v-model="rotateSpeed" direction="horizontal" :icon-size="12" class="home-radio">
                <nut-radio shape="button" label="1" :disabled="!showRotateFlag">快速</nut-radio>
                <nut-radio shape="button" label="2" :disabled="!showRotateFlag">中速</nut-radio>
                <nut-radio shape="button" label="3" :disabled="!showRotateFlag">慢速</nut-radio>
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
      :password="password"
      :encryptFlag="'1'"
    />
    <DialogWorkTitle
      :dialogVisible="dialogVisibleWorkTitle"
      @cancel="onWorkTitleDialogCancel"
      @ok="onWorkTitleDialogOk"
      :text=title
    />
    <DialogWorkAuthor
      :dialogVisible="dialogVisibleWorkAuthor"
      @cancel="onWorkAuthorDialogCancel"
      @ok="onWorkAuthorDialogOk"
      :text="author"
    />
    <DialogDesignDesc
      :dialogVisible="dialogVisibleDesignDesc"
      @cancel="onDesignDescDialogCancel"
      @ok="onDesignDescDialogOk"
      :text="intro"
    />
  </view>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import Taro from "@tarojs/taro";
import './index.scss'
import DialogWorkEncrypt from './DialogWorkEncrypt.vue'
import DialogWorkTitle from './DialogWorkTitle.vue'
import DialogWorkAuthor from './DialogWorkAuthor.vue'
import DialogDesignDesc from "./DialogDesignDesc.vue";
const password = ref('')
const title = ref('')
const author = ref('')
const intro = ref('')
const water = ref('')
const avatar = ref('')
// ----------------------作品加密---------------------
const dialogVisibleWorkEncrypt = ref(false)
const openWorkEncryptDialog = () => {
  dialogVisibleWorkEncrypt.value = true
}
const onWorkEncryptDialogCancel = () => {
  dialogVisibleWorkEncrypt.value = false
}
const panoid = ref('')
onMounted(()=>{
  panoid.value = Taro.getCurrentInstance().router.params.panoid
  console.log(panoid.value)
})
const onWorkEncryptDialogOk = (val,currentEncryptFlag) => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pwd',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      panoid: panoid.value,
      is_encrypt:currentEncryptFlag,
      pwd: val
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
  author.value = val
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
const onDesignDescDialogOk = (val) => {
  intro.value = val
  changeInfo()
}
// ----------------------背景音乐---------------------
const toSetBGM = () => {
  Taro.navigateTo({
    url: `/pages/BGMSet/index?panoid=${panoid.value}`,
  })
}
// ----------------------浏览量-----------------------
const viewCountFlag = ref(true)
const changeViewCountFlag = (value) => {
  console.log('changeViewCountFlag', value)
  viewCountFlag.value = value
  type.value = '6'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------点赞------------------------
const likeFlag = ref(true)
const changeLikeFlag = (value) => {
  console.log('changeLikeFlag', value)
  likeFlag.value = value
  type.value = '7'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------展示场景预览图----------------
const showPreviewFlag = ref(true)
const changeShowPreviewFlag = (value) => {
  console.log('changeShowPreviewFlag', value)
  showPreviewFlag.value = value
  type.value = '8'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------小行星开场-------------------
const showAsteroidFlag = ref(true)
const changeShowAsteroidFlag = (value) => {
  console.log('changeShowAsteroidFlag', value)
  showAsteroidFlag.value = value
  type.value = '9'
  is_open.value = value ? '1' : '0'
  moreSet()
}
// ----------------------自动旋转---------------------
const showRotateFlag = ref(true)
const changeShowRotateFlag = (value) => {
  console.log('changeShowRotateFlag', value)
  showRotateFlag.value = value
  if (value) {
    rotateSpeed.value = '1'
  } else {
    rotateSpeed.value = '-1'
  }
  type.value = '10'
  is_open.value = value ? '1' : '0'
  moreSet()
}
const rotateSpeed = ref('1')
const changeInfo = (value) => {
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pano_info',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uid:'39',
      panoid: panoid.value,
      name:title.value,
      author: author.value,
      intro: intro.value,
      water: water.value,
      avatar: avatar.value
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
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_more',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uid:'39',
      type: type.value,
      panoid: panoid.value,
      speed:speed.value,
      is_open: is_open.value,
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

const uploadImage = async () => {
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
          sessionid: '39',
        },
        success(res) {
          const data = res.data
          console.log(data)
          Taro.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail(err) {
          Taro.showToast({
            title: err,
            icon: 'error',
            duration: 2000
          })
          console.error('上传失败：', err)
        }
      })
    }
  })
};
</script>
