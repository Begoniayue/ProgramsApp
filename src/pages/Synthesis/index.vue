<template>
  <view class="upload-form">
    <nut-form
      class="upload-form-box"
      ref="formRef"
      :model-value="formData"
      :rules="{
      name: [
        { required: true, message: '请输入作品名称' },
        {
          message: '作品名称至少两个字符',
          validator: nameLengthValidator
        }
      ]
    }"
    >
      <nut-form-item label="作品名称：" prop="name">
        <nut-input
          v-model="formData.name"
          placeholder="请输入作品名称"
          type="text"
          class="work-name"
          @blur="customBlurValidate('name')"
        />
      </nut-form-item>
      <nut-form-item
        label="作品分类："
        prop="age"
        required
        :rules="[
        { required: true, message: '请选择作品分类' },
      ]"
      >
        <view class="work-type" @click="workShow = true">
          请选择作品分类
        </view>
        <nut-popup v-model:visible="workShow" position="bottom" class="work-pop">
          <nut-picker v-model="workchange" :columns="columns" @confirm="confirm" @cancel="workShow = false" />
        </nut-popup>
      </nut-form-item>
      <nut-form-item
        label="发布展示："
        prop="publish"
      >
        <nut-radio-group v-model="formData.publish" class="publish-box">
          <nut-radio label="1" shape="button">全景首页</nut-radio>
          <nut-radio label="2" shape="button">微官网(VIP)</nut-radio>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item
        label="水印展示："
        prop="water"
      >
        <nut-radio-group v-model="formData.waterFlag" class="publish-box">
          <nut-radio label="1" shape="button">开启防盗保护</nut-radio>
          <nut-radio label="2" shape="button">去除作品水印</nut-radio>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="上传全景：" class="upload-box">
        <view class="upload-img" @click="uploadImage">
          <view class="upload-img-icon" >
            <image src="../../../images/fangda.png"  />
            <view class="upload-img-text">上传2:1全景图</view>
          </view>
          <view class="upload-img-box" v-for="(item, index) in selectedImages" :key="index" @click="chooseImage">
            <!-- 如果有已选择的图片则显示预览图 -->
            <image v-if="item.url" :src="item.url"/>
            <!-- 删除按钮 -->
            <i class="delete-icon" v-if="item.url" title="删除图片" @click.stop="deleteImage(index)">&times;</i>
          </view>
        </view>

      </nut-form-item>
      <nut-space style="margin: 10px">
        <nut-button @click="submit" class="submit-btn">开始合成</nut-button>
      </nut-space>
      <nut-cell title="失败提示" is-link @click="openToast('fail', '失败提示')"></nut-cell>
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
  </view>
</template>
<script setup>
import Taro from "@tarojs/taro";
import { ref } from 'vue';
import './index.scss'
import {chooseImage,uploadFile} from "@tarojs/taro";
const formData = ref({
  name: '',
  age: '',
  waterFlag: '',
  publish: '',
  defaultFileList: [
    {
      name: '文件1.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'success',
      message: '上传成功',
      type: 'image'
    },
    {
      name: '文件2.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'uploading',
      message: '上传中...',
      type: 'image'
    }
  ]
});
const formRef = ref(null);
const workShow = ref(false);
const workchange = ref('');
const selectedImages = ref([
  {
    url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
  },
  {
    url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
  },
  {
    url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
  },
  {
    url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
  },
  {
    url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
  }
]);
const confirm = ({ selectedValue, selectedOptions }) => {
  console.log(selectedValue[0], selectedOptions[0]);
  workShow.value = false;
};

const submit = () => {
  formRef.value?.validate().then(({ valid, errors }) => {
    if (valid) {
      console.log('success:', formData.value);
    } else {
      console.warn('error:', errors);
    }
  });
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
// 函数校验
const columns = ref([
  { text: '普通住宅', value: '普通住宅' },
  { text: '别墅豪宅', value: '别墅豪宅' },
  { text: '现代', value: '现代' },
  { text: '法式', value: '现代' },
]);
const nameLengthValidator = (val) => {
  if (val.length > 2) {
    return Promise.resolve();
  } else {
    return Promise.reject('名称两个字以上');
  }
};
// Promise 异步校验
const asyncValidator = (val) => {
  const telReg = /^400(-?)[0-9]{7}$|^1\d{10}$|^0[0-9]{2,3}-[0-9]{7,8}$/;
  return new Promise((resolve, reject) => {
    console.log('模拟异步验证中...');
    setTimeout(() => {
      if (!val) {
        reject('请输入联系电话');
      } else if (!telReg.test(val)) {
        reject('联系电话格式不正确');
      } else {
        resolve('');
      }
    }, 1000);
  });
};
/*上传*/
const uploadImage = async () => {
  const { tempFiles } = await Taro.chooseImage({
    count: 1,
  });
  selectedImages.value.push(tempFiles[0]);
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
const onClosed = () => console.log('closed');

/*合成*/
import { ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';

const statusCode = ref(0);

// 在组件挂载后开始刷新接口
onMounted(() => {
  refreshApi();
});

const refreshApi = () => {
  // 发起网络请求
  requestApi();
};

const requestApi = () => {
  const apiUrl = 'https://your-api-endpoint.com/data';

  Taro.request({
    url: apiUrl,
    method: 'GET',
    success: (res) => {
      const newStatusCode = res.statusCode;

      // 判断状态码
      if (newStatusCode === 200) {
        console.log('接口返回状态码 200，操作完成');
      } else if (newStatusCode === -200) {
        console.log('接口返回状态码 -200，继续刷新接口');
        // 在这里可以添加一些其他逻辑，例如处理数据等

        // 等待一段时间后继续刷新接口
        setTimeout(() => {
          requestApi();
        }, 2000); // 间隔 2000 毫秒（2 秒）
      } else {
        console.error('接口返回状态码异常:', newStatusCode);

        // 在第二次及以后的 -200 状态码时报错
        if (statusCode.value === -200) {
          console.error('第二次及以后的 -200 状态码，报错');
        }

        // 更新状态码
        statusCode.value = newStatusCode;
      }
    },
    fail: (error) => {
      console.error('调用接口失败:', error);
      // 在这里处理请求失败的情况
    },
  });
};
</script>
