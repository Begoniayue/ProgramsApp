<template>
  <view class="upload-form">
    <nut-form
      class="upload-form-box"
      ref="formRef"
      prop="title"
      :model-value="formData"
      :rules="{
      title: [
        { required: true, message: '请输入作品名称' },
      ]
    }"
    >
      <nut-form-item label="作品名称" required prop="title">
        <nut-input v-model="formData.title" placeholder="请输入作品名称" type="text"  @blur="customBlurValidate('name')" class="form-input"/>
      </nut-form-item>
      <nut-form-item
          label="作品分类"
          required
          prop="checkBigcate"
          :rules="[
          { required: true, message: '请选择作品分类' },
      ]"
      >
        <view class="work-type" v-if="checkBigcate && checksmallcate" @click="workShow = true">
          {{checkBigcate}}-{{checksmallcate}}
        </view>
        <view v-else class="work-type" @click="workShow = true">
          <nut-input v-model="formData.checkBigcate" placeholder="请选择作品分类" type="text" readonly class="form-input"/>
<!--          <image src="../../../images/arrow.png" class="work-icon"/>-->
        </view>
      </nut-form-item>
      <nut-form-item
        label="发布展示"
        prop="publish"
        class="publish-wrap"
      >
        <view class="publish-box">
          <nut-checkbox v-model="wantshow" shape="button"> 全景首页 </nut-checkbox>
          <nut-checkbox v-model="myshow" shape="button" @change="vipShow(1)"> 微官网(VIP) </nut-checkbox>
        </view>
      </nut-form-item>
      <nut-form-item
        label="水印展示"
        prop="water"
        class="publish-wrap-water"
      >
        <view class="publish-box-vip">
<!--          <nut-checkbox v-model="water_text" shape="button"> 开启防盗保护 </nut-checkbox>-->
          <nut-checkbox v-model="water_text_open" shape="button" @change="vipShow(2)"> 去除作品水印（VIP）</nut-checkbox>
        </view>
      </nut-form-item>
      <nut-form-item label="上传全景" class="upload-box">
<!-- @click="uploadImage"       -->
        <view class="upload-img" @click="uploadFileFlag">
          <view class="upload-img-icon" >
            <image src="../../../images/fangda.svg"  />
            <view class="upload-img-text">上传2:1全景图</view>
          </view>
          <view class="upload-img-box"  @click="chooseImage">
            <!-- 如果有已选择的图片则显示预览图 -->
            <view style="display: flex;flex-flow: wrap;">
              <view v-for="(item, index) in selectedImages" :key="index" style="position: relative">
                <image :src="'https://vrimg.justeasy.cn/' + item.url"  mode="aspectFit" />
                <!-- 删除按钮 -->
                <i class="delete-icon" v-if="item.url" title="删除图片" @click.stop="deleteImage(index)">&times;</i>
              </view>
              <view v-for="(item, index) in sceneidsPreview" :key="index" style="position: relative">
                <image :src="item.preview"  mode="aspectFit" />
                <!-- 删除按钮 -->
                <i class="delete-icon" v-if="item.preview" title="删除图片" @click.stop="deleteImageSceneids(index)">&times;</i>
              </view>
            </view>
          </view>
        </view>
      </nut-form-item>
    </nut-form>
    <view class="upload-tip">
      <view class="upload-tip-title">
        上传说明：
      </view>
      <view class="upload-tip-content">
        <view>1、请上传2:1比例的JPG图片，建议尺寸5000-12000px；</view>
        <view>2、会员用户不超出60MB，非会员不超出30MB；</view>
        <view>3、合成页面单次最多上传5个场景，开始合成后会员前往网页端编辑页可上传至60个；</view>
        <view>4、作品信息修改等请到作品管理页面编辑。</view>
      </view>
    </view>
    <view class="upload-btn">
      <nut-button @click="submit" class="submit-btn">开始合成</nut-button>
    </view>
    <nut-popup v-model:visible="showFlag" position="bottom" :style="{ height: '18%' }">
      <nut-cell class="set-pop"  @click="toMaterial">
        <view>素材库选择</view>
      </nut-cell>
      <nut-cell class="set-pop"  @click="uploadImage">
        <view>本地上传</view>
      </nut-cell>
    </nut-popup>
    <nut-popup v-model:visible="workShow" position="bottom" class="work-pop">
      <nut-picker v-model="formData.classify" :columns="columns" @confirm="confirm" @cancel="workShow = false" />
    </nut-popup>
    <VipDilaog
        :dialogVisible="vipVisible"
        @cancel="vipCancelSynthesis"
    />
<!--    <LoginTipDaliog-->
<!--        :dialogVisible="LoginTipVisible"-->
<!--        @ok="closeLoginTip"-->
<!--    />-->
  </view>
</template>
<script setup>
import Taro from "@tarojs/taro";
import { ref, onMounted } from 'vue';
import './index.scss'
import CryptoJS from 'crypto-js';
import {chooseImage,uploadFile} from "@tarojs/taro";
let bigcateList =  ref([])
let smallcateList =  ref([])
const checkBigcate = ref('')
const checksmallcate = ref('')
const wantshow = ref(false)
const LoginTipVisible = ref(false)
const myshow = ref(false)
const vipVisible = ref(false)
const water_text = ref(false)
const showFlag = ref(false)
const water_text_open = ref(false)
const formData = ref({
  title: '',
  classify: [],
  checkBigcate:'',
});
import { useDidShow } from '@tarojs/taro'
const uploadData = ref({})
const formRef = ref(null);
const workShow = ref(false);
const workchange = ref([0, 0]);
const selectedImages = ref([]);
const confirm = ({ selectedValue, selectedOptions }) => {
  checkBigcate.value = selectedOptions[0].text
  checksmallcate.value = selectedOptions[1].text
  formData.value.classify = selectedValue;
  formData.value.checkBigcate = selectedOptions[0].text;
  workShow.value = false;
};
const uploadFileFlag = () => {
  if(userUid.value == null || userUid.value === ''){
    Taro.showToast({
      title: '请先登录',
      icon: 'error',
      duration: 2000
    })
    return;
  }
  const urls = selectedImages.value.map(item => item.url).filter(url => url !== ''); // 过滤掉空字符串（即 url 为空的情况）;
  console.log(selectedImages);
  if (urls.length === 5){
    Taro.showToast({
      title: '最多上传5张图片',
      icon: 'none',
      duration: 2000
    })
    return
  }
  showFlag.value = true;
};
import generateAndEncryptToken from '../../util/sort.js'
const submit = () => {
  const urls = selectedImages.value.map(item => item.url).filter(url => url !== ''); // 过滤掉空字符串（即 url 为空的情况）;
  const pic = urls.length > 1 ? urls.join(',') : urls[0] || '';
  const sceneid = sceneids.value.map(item =>item.value).join(',').slice(1);
  // const sceneid =  sceneids.value.length > 1 ? sceneids.value.join(',') : sceneids.value[0] || '';
  console.log(sceneids.value,sceneid,'sceneid',urls)
  const sortedData = {
    bcate: formData.value.classify[0] || 0,
    scate: formData.value.classify[1] || 0,
    title: formData.value.title,
    wantshow: wantshow.value ? 1 : 0,
    myshow: myshow.value ? 1 : 0,
    // water_text: water_text.value,
    water_text_open: water_text_open.value ? 1 : 0,
    pic: pic,
    sceneids:sceneid,
    uesr_token: Taro.getStorageSync('userUid')
  };
  console.log(encryptedToken); // 页面上只需要使用这个encryptedToken
  const filteredData = Object.entries(sortedData)
    .filter(([key, value]) => value !== null && value !== ''&& value !== undefined)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
// 将对象的键按字母顺序排序并转换为查询字符串
  const queryString = Object.entries(filteredData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  const encryptedToken = CryptoJS.MD5(queryString+'YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString();
  console.log(encryptedToken,'encryptedData')
  console.log('formData', formData.value,selectedImages.value);
  if (pic.length!== 0 || sceneid.length !== 0 ){
    formRef.value?.validate().then(({ valid, errors }) => {
      if (valid) {
        Taro.showLoading({
          title: '加载中',
        })
        let imageUrls = selectedImages.value.join(',');
        console.log('success:',selectedImages.value,selectedImages.value.join(','));
        Taro.request({
          url: 'https://vr.justeasy.cn/xcx/pano/create_vr',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
           ...sortedData,
            token: encryptedToken
          }
        }).then((res) => {
          if (res.data.status === 200) {
            uploadData.value = res.data.data;
            if (uploadData.value) {
              requestApi(uploadData.value);
            }
          } else {
            Taro.showToast({
              title: res.data.msg,
              icon: 'error',
              duration: 2000
            })
            throw new Error('Failed to fetch data');
          }
        });
      } else {
        Taro.showToast({
          title: '请填写必填项',
          icon: 'error',
          duration: 2000
        })
        console.warn('error:', errors);
      }
    });
  }else {
    Taro.showToast({
      title: '请上传全景图',
      icon: 'error',
      duration: 2000
    })
  }
};
const vipShow = (type) =>{
  console.log('vipShow',userVip.value )
  switch (type){
    case 1:
      if(String(userVip.value) === '0'){
        vipVisible.value = true
        myshow.value = false
      }
      break;
    case 2:
      if(String(userVip.value) === '0'){
        vipVisible.value = true
        water_text_open.value = false
      }
      break;
  }
}
const vipCancelSynthesis = () =>{
  console.log( vipVisible.value,' vipVisible.value')
  vipVisible.value = false
}
// 失去焦点校验
const customBlurValidate = (prop) => {
  formRef.value?.validate(prop).then(({ valid, errors }) => {
    if (valid) {
      console.log('success:', formData.value);
    } else {
      console.warn('error:', errors);
    }
  });
};
const columns = ref([]);
const nameLengthValidator = (val) => {
  if (val.length > 2) {
    return Promise.resolve();
  } else {
    return Promise.reject('名称两个字以上');
  }
};
/*上传*/
const uploadImage = async () => {
  console.log(selectedImages.value , 'selectedImages.value ')
  selectedImages.value = selectedImages.value.filter(item => item.url !== '');
  console.log(selectedImages.value ,'selectedImages.value ')
  showFlag.value = false;
  material.value = false
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
        url: 'https://vr.justeasy.cn/User/Upload/image/pano/1.php', // 上传的地址
        filePath: tempFilePaths[0],
        name:'file',
        formData:{
          sessionid: sessionid,
        },
        success: function(res) {
          let dataStr = res.data.trim(); // 去除字符串前后空白字符
          if (dataStr.startsWith('\uFEFF')) {
            dataStr = dataStr.substring(1); // 移除BOM字符
          }
          let data;
          try {
            data = JSON.parse(dataStr);
            if (data.status === 200 && data.filename) {
              selectedImages.value.push({
                url: data.filename
              });
              console.log(data.filename,'selectedImages',selectedImages.value)
            } else {
              Taro.showToast({
                title: data.msg,
                icon: 'error',
                duration: 2000
              })
            }
          } catch (error) {
          }
      },
        fail(err) {
          Taro.showToast({
            title: '上传失败',
            icon: 'error',
            duration: 2000
          })
          console.error('上传失败：', err)
        }
      })
    }
  })
};
const deleteImage = (index) =>{
  selectedImages.value.splice(index, 1);
};
const deleteImageSceneids = (index) =>{
  console.log('deleteImageSceneids', Taro.getStorageSync('materialList'), sceneidsPreview.value)
  sceneidsPreview.value.splice(index, 1);
  sceneids.value.splice(index, 1);
  Taro.setStorageSync('materialList', Taro.getStorageSync('materialList').filter((item, index) => {
    return item.sceneid !== sceneidsPreview.value[index]
  }));
};
/*
 chooseImage = async () => {
      const { tempFiles } = await Taro.chooseImage({
        count: 1,
      });
      this.selectedImages.push(tempFiles[0]);
    },
* */
/*失败提示*/
import { reactive } from 'vue';
import VipDilaog from "../../components/Dialog/VipDilaog.vue";
import LoginTipDaliog from "../../components/Dialog/LoginTipDaliog.vue";
const state = reactive({
  msg: 'toast',
  type: 'text',
  show: false,
  cover: false,
  title: '请上传2:1的全景图',
  bottom: '0',
  center: true
});
const openToast = (type, msg, cover = false) => {
  Taro.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
};
/*合成*/
const statusCode = ref(0);

const requestApi = (uploadData) => {
  const { edit_url, ...newUploadData } = uploadData;
  const apiUrl = 'https://vr.justeasy.cn/xcx/pano/validate';
  Taro.request({
    url: apiUrl,
    method: 'POST',
    data: newUploadData,
    success: (res) => {
      const newStatusCode = res.data
      console.log('接口返回状态码:', newStatusCode);
      // 判断状态码
      if (newStatusCode.data !== null) {
        Taro.showToast({
          title:'合成成功'
        })
        formData.value.classify = ''
        formData.value.title = ''
        formData.value.checkBigcate = ''
        water_text.value = ''
        wantshow.value = false
        water_text_open.value = false
        myshow.value = false
        selectedImages.value = [];
        sceneidsPreview.value = [];
        checkBigcate.value=''
        checksmallcate.value=''
        Taro.removeStorageSync('materialList')
        console.log(' formData.value', formData.value);
      } else {
        // 在这里可以添加一些其他逻辑，例如处理数据等
        // 等待一段时间后继续刷新接口
        setTimeout(() => {
          requestApi(uploadData);
        }, 2000); // 间隔 2000 毫秒（2 秒）
      }
    },
    fail: (error) => {
      console.error('调用接口失败:', error);
      // 在这里处理请求失败的情况
    },
  });
};
const siftDate = () =>{
  return Taro.request({
    url: 'https://vr.justeasy.cn/Xcx/pano/get_cate',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      const formattedBigCate = res.data.data.bigcate.map(item => ({ value: item.id, text: item.name }));
      bigcateList.value = formattedBigCate;
      const formattedSmallCate = res.data.data.smallcate.map(item => ({ value: item.id, text: item.name }));
      smallcateList.value = formattedSmallCate;
      const columnsList = [
        formattedBigCate,
        formattedSmallCate
      ]
      columns.value = columnsList;
      console.log(columns)
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const material = ref(false);
const toMaterial = (key, data) => {
  showFlag.value = false
  material.value = true
  Taro.setStorageSync('material', material.value)
  Taro.navigateTo({
    url: `/pages/Material/index`,
  })
}
const sceneids = ref([])
const sceneidsPreview = ref([])
const getMaterial = () => {
  const value = Taro.getStorageSync('materialList')
  console.log(value,"value")
  const index = sceneids.value.findIndex(item => item === value);
  // 如果不存在，则将新对象推入数组
  if (index === -1) {
    sceneids.value.push({
      value
    });
  }
  console.log(sceneids.value,"sceneids.value")
  const sceneid = sceneids.value.map(item =>item.value).join(',').slice(1);
  console.log(sceneid,'scenid')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_scene_info',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data:{
      sceneid: sceneid
    }
  }).then((res) => {
    if (res.data.status === 200) {
      sceneidsPreview.value = res.data.data
    }else {
      Taro.toast({
        title: '获取失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}
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
    }else {
      Taro.removeStorageSync('userUid');
    }
  })
}

useDidShow(() => {
  // formData.value.classify = ''
  // formData.value.title = ''
  // formData.value.checkBigcate = ''
  // water_text.value = ''
  // wantshow.value = false
  // water_text_open.value = false
  // myshow.value = false
  // selectedImages.value = [];
  // checkBigcate.value=''
  // checksmallcate.value=''
  userUid.value = Taro.getStorageSync('userUid')
  if(Taro.getStorageSync('userUid') == null || Taro.getStorageSync('userUid') === ''){
    LoginTipVisible.value = true
  }
  getMaterial()
})
onMounted(()=>{
  getUid()
})
const closeLoginTip = () =>{
  LoginTipVisible.value = false
}
const userUid = ref('')
const userVip = ref('')
useDidShow(()=>{
  console.log(Taro.getStorageSync('UserVip'))
  siftDate();
  userVip.value = Taro.getStorageSync('UserVip')
  console.log(userVip.value, 'userVip')
})
</script>
