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
        label="作品分类："
        prop="classify"
        required
        v-model="formData.classify"
        :rules="[
        { required: true, message: '请选择作品分类' },
      ]"
      >
        <view class="work-type" v-if="checkBigcate && checksmallcate">
          {{checkBigcate}}-{{checksmallcate}}
        </view>
        <view v-else class="work-type" @click="workShow = true">
          请选择作品分类
          <image src="../../../images/arrow.png" class="work-icon"/>
        </view>
        <nut-popup v-model:visible="workShow" position="bottom" class="work-pop">
          <nut-picker v-model="formData.classify" :columns="columns" @confirm="confirm" @cancel="workShow = false" />
        </nut-popup>
      </nut-form-item>
      <nut-form-item
        label="发布展示："
        prop="publish"
        class="publish-wrap"
      >
        <view class="publish-box">
          <nut-checkbox v-model="wantshow" shape="button"> 全景首页 </nut-checkbox>
          <nut-checkbox v-model="myshow" shape="button"> 微官网(VIP) </nut-checkbox>
        </view>
      </nut-form-item>
      <nut-form-item
        label="水印展示："
        prop="water"
        class="publish-wrap"
      >
        <view class="publish-box">
          <nut-checkbox v-model="water_text" shape="button"> 开启防盗保护 </nut-checkbox>
          <nut-checkbox v-model="water_text_open" shape="button"> 去除作品水印</nut-checkbox>
        </view>
      </nut-form-item>
      <nut-form-item label="上传全景：" class="upload-box">
<!-- @click="uploadImage"       -->
        <view class="upload-img" @click="showFlag = true">
          <view class="upload-img-icon" >
            <image src="../../../images/fangda.png"  />
            <view class="upload-img-text">上传2:1全景图</view>
          </view>
          <view class="upload-img-box" v-for="(item, index) in selectedImages" :key="index" @click="chooseImage">
            <!-- 如果有已选择的图片则显示预览图 -->
            <image v-if="item.url && !material"  :src="'https://vrimg.justeasy.cn/' + item.url"  mode="aspectFit" />
            <image v-else-if="item.url && material"  :src="item.url" />
            <!-- 删除按钮 -->
            <i class="delete-icon" v-if="item.url" title="删除图片" @click.stop="deleteImage(index)">&times;</i>
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
        <view>3、合成页面单次最多上传10个场景，开始合成后会员前往编辑页可上传至60个；</view>
        <view>4、作品信息修改等请到作品管理页面编辑。</view>
      </view>
    </view>
    <view class="upload-btn">
      <nut-button @click="submit" class="submit-btn">开始合成</nut-button>
    </view>
    <nut-popup v-model:visible="showFlag" position="bottom" :style="{ height: '18%' }">
      <nut-cell class="set-pop">
        <view @click="toMaterial">素材库选择</view>
      </nut-cell>
      <nut-cell class="set-pop">
        <view @click="uploadImage">本地上传</view>
      </nut-cell>
    </nut-popup>
  </view>
</template>
<script setup>
import Taro from "@tarojs/taro";
import { ref, onMounted } from 'vue';
import './index.scss'
import {chooseImage,uploadFile} from "@tarojs/taro";
let bigcateList =  ref([])
let smallcateList =  ref([])
const checkBigcate = ref('')
const checksmallcate = ref('')
const wantshow = ref(false)
const myshow = ref(false)
const water_text = ref(false)
const showFlag = ref(false)
const water_text_open = ref(false)
const formData = ref({
  title: '',
  classify: [],
});
import { useDidShow } from '@tarojs/taro'

const uploadData = ref({})
const formRef = ref(null);
const workShow = ref(false);
const workchange = ref([0, 0]);
const selectedImages = ref([]);
const confirm = ({ selectedValue, selectedOptions }) => {
  console.log(workchange,'workchange')
  console.log(selectedValue[0], selectedOptions[0],selectedValue[1],selectedOptions[1]);
  checkBigcate.value = selectedOptions[0].text
  checksmallcate.value = selectedOptions[1].text
  formData.value.classify = selectedValue;
  workShow.value = false;
};
import CryptoJS from 'crypto-js';
const submit = () => {
  const sortedData = {
    bcate: formData.value.classify[0],
    scate: formData.value.classify[1],
    title: formData.value.title,
    wantshow: wantshow.value ? 1 : 0,
    myshow: myshow.value ? 1 : 0,
    water_text: water_text.value || null,
    water_text_open: water_text_open.value ? 1 : 0,
    pic: selectedImages.value.map(item => item.url).join(','),
    sceneids:'',
    uesr_token: Taro.getStorageSync('userUid')
  };
  const orderedData = {};
  Object.keys(sortedData).sort().forEach(key => {
    orderedData[key] = sortedData[key];
  });
  const queryString = Object.keys(orderedData)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(orderedData[key])}`)
      .join('&');
  console.log(queryString+'YYlk*sdf000&&af#~@&987xdSJFF**sfsh','queryString')
  const encryptedToken = CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString();
  console.log(encryptedToken,'encryptedData')
  if (selectedImages.value.length!== 0){
    Taro.showLoading({
      title: '加载中',
    })
    formRef.value?.validate().then(({ valid, errors }) => {
      if (valid) {
        let imageUrls = selectedImages.value.join(',');
        console.log('success:', formData.value,selectedImages.value,selectedImages.value.join(','));
        Taro.request({
          url: 'https://vr.justeasy.cn/xcx/pano/create_vr',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            bcate: formData.value.classify[0],
            scate: formData.value.classify[1],
            title: formData.value.title,
            wantshow: wantshow.value ? 1 : 0,
            myshow: myshow.value ? 1 : 0,
            water_text: water_text.value || null,
            water_text_open: water_text_open.value ? 1 : 0,
            pic: selectedImages.value.map(item => item.url).join(','),
            sceneids:'',
            uesr_token:Taro.getStorageSync('userUid'),
            token: CryptoJS.MD5('YYlk*sdf000&&af#~@&987xdSJFF**sfsh').toString()
          }
        }).then((res) => {
          if (res.statusCode === 200) {
            console.log(res.data.data);
            uploadData.value = res.data.data;
            if (uploadData.value) {
              requestApi(uploadData.value);
            }
          } else {
            Taro.showToast({
              title: res.data.data.msg,
              icon: 'error',
              duration: 2000
            })
            throw new Error('Failed to fetch data');
          }
        });
      } else {
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
          sessionid: '39',
        },
        success: function(res) {
          let dataStr = res.data.trim(); // 去除字符串前后空白字符
          if (dataStr.startsWith('\uFEFF')) {
            dataStr = dataStr.substring(1); // 移除BOM字符
          }
          let data;
          try {
            data = JSON.parse(dataStr);
            if (data.status === 200) {
              selectedImages.value.push({
                url: data.filename
              });
            } else {
              Taro.showToast({
                title: data.msg,
                icon: 'error',
                duration: 2000
              })
            }
          } catch (error) {
            console.error('Invalid server response format - could not parse as JSON:', dataStr);
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
        Taro.navigateTo({
          url: `/pages/webview/index?url=${newStatusCode.edit_url}`,
        })
      } else {
        console.log('接口返回状态码 -200，继续刷新接口');
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
const toMaterial = () => {
  showFlag.value = false
  Taro.navigateTo({
    url: `/pages/Material/index`,
  })
}
const getMaterial = () => {
  const value = Taro.getStorageSync('materialList')
  console.log(value, 'materialList','value')
  let newUrl = value.replace("https://vrimg.justeasy.cn/", "");
  const index = selectedImages.value.findIndex(item => item.url === value);
  // 如果不存在，则将新对象推入数组
  if (index === -1) {
    selectedImages.value.push({
      url: newUrl,
    });
  }
  Taro.removeStorageSync('materialList');
}
useDidShow(() => {
  getMaterial()
})
const userUid = ref('')
onMounted(()=>{
  userUid.value = Taro.getStorageSync('userUid')
  siftDate();
})
</script>
