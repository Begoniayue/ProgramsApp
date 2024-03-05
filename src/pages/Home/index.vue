<template>
  <view class="home-content">
    <view class="home-top-wrap">
      <view class="user-info-container">
        <view class="avatar-container">
          <image :src="UserInfo.avatar" class="avatar-img"/>
        </view>
        <view class="info-container">
          <view class="user-info" v-if="UserVip === '165'">
           <view class="user-name">{{ UserInfo.username }}</view>
           <view class="vip-icon"><image src="../../../images/vip.png" /></view>
           <view class="vip-date">(会员到期：{{ UserInfo.all.vip_endtime }})</view>
          </view>
          <view class="user-info" v-else>
            <view class="user-name">{{ UserInfo.username }}</view>
            <view class="open-vip">开通全景VIP</view>
          </view>
          <!-- 其他用户信息 -->
          <div class="work-capacity">
            <view class="work-text">作品容量：</view>
            <view class="work-count">
              <view class="work-count-text">{{ UserInfo.history }}</view>
              <view class="work-count-total">/{{ UserInfo.total }}</view>
              <view class="work-icon" @click="openTips"> <image src="../../../images/ask.png" /></view>
            </view>
          </div>
          <nut-popup v-model:visible="showTips" position="bottom" closeable :style="{ height: '20%' }">
            <view class="tip-wrap">
              <view class="text">
                <text class="text-bold">会员容量:{{ UserInfo.total }}</text>(限时，会员期可用)
              </view>
<!--              <view class="text">-->
<!--                <b>扩容商城:14000</b>(限时，会员期可用)-->
<!--              </view>-->
<!--              <view class="text">-->
<!--                <b>付费容量:0</b>-->
<!--              </view>-->
<!--              <view class="text">-->
<!--                <b>永久赠送:0</b>(永久，旧版扩容套餐充值补偿)-->
<!--              </view>-->
              <view class="text">
                <text class="text-bold">历史作品数: {{ UserInfo.history }}</text>
              </view>
              <view class="text">
                (历史作品:{{ UserInfo.vip_start_time }} 前全部作品数历史作品不占内存，删除该时段作品不释放容量)
              </view>
            </view>
          </nut-popup>
          <!-- 进度条 -->
          <nut-progress
            stroke-color="linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(174,72,241,1) 32.815625%,rgba(108,107,252,1) 100%)"
            :percentage="(UserInfo.history/UserInfo.total)*100"
            :show-text="false"
            status="active"
            class="progress"
          />
        </view>
      </view>

    </view>
    <view class="home-web-wrap">
      <image src="../../../images/web.png"></image>
      <view class="web-btn" @click="openInternet">点击了解</view>
    </view>
    <!--选项-->
    <view>
<!-- 搜索     -->
      <nut-tabs v-model="type" class="home-tabs" @click="tabClick">
        <nut-tab-pane title="全景图" pane-key="0" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywords" placeholder="搜索全景关键词">
              <template #rightout>
                <view class="icon">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/paixu.png"
                  />
                </view>
                <view class="icon">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/icon.png"
                  />
                </view>
              </template>
              <template #leftin>  <IconFont name="search"></IconFont> </template>
            </nut-searchbar>
          </view>
          <view class="item">
            <view class="item-list" v-for="(item, index) in dataList" :key="index">
              <view class="left-container">
                <image :src="item.preview" mode="aspectFit" class="image"></image>
              </view>
              <view class="right-container">
                <view class="info-line">
                  <view class="work-title">{{ item.name }}</view>
                  <view class="share-text" @click="shareLink(item)">分享</view>
                </view>
                <view class="info-line">
                  <view class="date">{{ item.addtime }}</view>
                </view>
                <view class="info-line">
                  <view class="vide-wrap">
                    <image src="../../../images/video.png" mode="aspectFit" class="icon"></image>
                    <view class="text">生成短视频</view>
                  </view>
                  <view class="right-set">
                    <image class="icon" src="../../../images/set.png"></image>
                    <image class="icon" src="../../../images/gengduo.png"></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="平面图" pane-key="11" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywords" placeholder="搜索全景关键词">
              <template #rightout>
                <view class="icon">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/paixu.png"
                  />
                </view>
                <view class="icon">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/icon.png"
                  />
                </view>
              </template>
              <template #leftin>  <IconFont name="search"></IconFont> </template>
            </nut-searchbar>
          </view>
          <view class="item">
            <view class="item-list" v-for="(item, index) in dataList" :key="index">
              <view class="left-container">
                <image :src="item.preview" mode="aspectFit" class="image"></image>
              </view>
              <view class="right-container">
                <view class="info-line">
                  <view class="work-title">{{ item.name }}</view>
                  <view class="share-text" @click="shareLink(item)">分享</view>
                </view>
                <view class="info-line">
                  <view class="date">{{ item.addtime }}</view>
                </view>
                <view class="info-line">
                  <view class="vide-wrap">
<!--                    <image src="../../../images/video.png" mode="aspectFit" class="icon"></image>-->
<!--                    <view class="text">生成短视频</view>-->
                  </view>
                  <view class="right-set">
                    <image class="icon" src="../../../images/set.png"></image>
                    <image class="icon" src="../../../images/gengduo.png"></image>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="预约信息" pane-key="3" class="list-box">
          <nut-tabs v-model="bookValue" @click="getBookInfo">
            <nut-tab-pane title="全景作品预约" pane-key="1" class="book-list">
              <view class="book-wrap">
                <view class="book-item" v-for="(item, index) in bookData" :key="index">
                  <nut-cell>
                    <template #title>
                        <span>
                          <view class="work-title">
                              <view> {{ item.nickname }} </view>
                              <view> {{ item.mobile }} </view>
                          </view>
                          <view class="book-time">{{ item.addtime }}</view>
                        </span>
                      <view class="book-info">{{ item.info }}</view>
                    </template>
                  </nut-cell>
                </view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="微官网预约" pane-key="2" class="book-list">
              <view class="book-wrap">
                <view class="book-item" v-for="(item, index) in bookData" :key="index">
                  <nut-cell>
                    <template #title>
                        <span>
                          <view class="work-title">
                              <view> {{ item.nickname }} </view>
                              <view> {{ item.mobile }} </view>
                          </view>
                          <view class="book-time">{{ item.addtime }}</view>
                        </span>
                      <view class="book-info">{{ item.info }}</view>
                    </template>
                  </nut-cell>
                </view>
              </view>
            </nut-tab-pane>
          </nut-tabs>
        </nut-tab-pane>
        <nut-tab-pane title="素材库" pane-key="4" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywords" placeholder="搜索素材库关键词">
              <template #leftin>  <IconFont name="search"></IconFont> </template>
            </nut-searchbar>
          </view>
          <nut-tabs v-model="materialType" align="left" @click="getMaterial">
            <nut-tab-pane title="原创" pane-key="-1" class="book-list">
              <view class="item">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container">
                    <image :src="item.preview" mode="aspectFit" class="image"></image>
                  </view>
                  <view class="right-container">
                    <view class="info-line">
                      <view class="work-title">{{ item.scenename }}</view>
                    </view>
                    <view class="info-line">
                      <view class="vide-wrap">
                        <view class="date">{{ item.addtime }}</view>
                      </view>
                      <view class="right-set">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="已购" pane-key="1" class="book-list">
              <view class="item">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container">
                    <image :src="item.preview" mode="aspectFit" class="image"></image>
                  </view>
                  <view class="right-container">
                    <view class="info-line">
                      <view class="work-title">{{ item.scenename }}</view>
                    </view>
                    <view class="info-line">
                      <view class="vide-wrap">
                        <view class="date">{{ item.addtime }}</view>
                      </view>
                      <view class="right-set">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="VIP场景" pane-key="6" class="book-list">
              <view class="item">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container">
                    <image :src="item.preview" mode="aspectFit" class="image"></image>
                  </view>
                  <view class="right-container">
                    <view class="info-line">
                      <view class="work-title">{{ item.scenename }}</view>
                    </view>
                    <view class="info-line">
                      <view class="vide-wrap">
                        <view class="date">{{ item.addtime }}</view>
                      </view>
                      <view class="right-set">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </nut-tab-pane>
          </nut-tabs>
        </nut-tab-pane>
        <nut-tab-pane title="回收站" pane-key="5" class="list-box">
          <view class="recyle-wrap">
            <view>
              会员删除作品将在回收站保留30天，非会员保留15天
            </view>
            <view @click="showSet = true">
              <image class="icon" src="../../../images/set.png" mode="aspectFit"></image>
            </view>
          </view>
          <view class="item">
            <view class="item-list" v-for="(item, index) in recycleList" :key="index">
              <view class="left-container">
                <image :src="item.preview" mode="aspectFit" class="image"></image>
              </view>
              <view class="right-container">
                <view class="info-line">
                  <view class="work-title">{{ item.name }}</view>
                </view>
                <view class="info-line">
                  <view class="date">{{ item.addtime }}</view>
                  <view class="date">{{ item.endtime }}</view>
                </view>
                <view class="info-line">
                  <view class="vide-wrap">
                    <view class="delete">删除</view>
                    <view class="refer">恢复</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </nut-tab-pane>
      </nut-tabs>
<!--分享-->
      <nut-popup v-model:visible="showShare" position="bottom" :style="{ height: '40%' }" class="popupShare">
        <view class="share-title">直接分享</view>
        <view class="share-wrap">
          <view class="share-item">
            <button class="share-content" open-type="share" @click="shareLink">
              <image src="../../../images/chat.png" mode="aspectFit" class="share-icon"></image>
              <view class="share-type" v-if="String(useAppEnv.currentEnv) === 'WEAPP'">
                微信好友
              </view>
              <view class="share-type" v-else>选择分享方式</view>
            </button>
          </view>
          <view class="share-item">
            <view>
              <image src="../../../images/link.png" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share" @click="shareLink">作品链接</view>
          </view>
          <view class="share-item">
            <view>
              <image src="../../../images/code.png" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share" @click="shareLink">作品二维码</view>
          </view>
        </view>
<!--  vip      -->
        <view class="share-title">你还可以选择（部分功能vip）</view>
        <view class="share-wrap">
          <view class="share-item">
            <view>
              <image src="../../../images/cardgreen.png" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share" @click="shareLink">临时链接</view>
          </view>
          <view class="share-item">
            <view>
              <image src="../../../images/card.png" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share" @click="shareLink">作品加密</view>
          </view>
          <view class="share-item">
            <view>
              <image src="../../../images/cardblue.png" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share" @click="shareLink">生成卡片</view>
          </view>
        </view>
      </nut-popup>
<!-- 设置 -->
      <nut-popup v-model:visible="showSet" position="bottom" :style="{ height: '18%' }">
        <nut-cell class="set-pop">
          <view style="text-align:center">回收站密码</view>
        </nut-cell>
        <nut-cell>
          <view>清空回收站</view>
        </nut-cell>
      </nut-popup>
<!--      <nut-dialog-->
<!--          title="作品加密"-->
<!--          v-model:visible="visible"-->
<!--          @cancel="onOk"-->
<!--          @ok="onCancel"-->
<!--      >-->
<!--      </nut-dialog>-->
<!--      <nut-dialog title="基础弹框" content="这是基础弹框。" v-model:visible="visible" @cancel="onCancel" @ok="onOk" />-->
    </view>
  </view>
</template>
<script setup>
import { useAppEnvStore } from '../../stores/appEnvStore'
import Taro from '@tarojs/taro';
import {onMounted, ref} from 'vue';
import './index.scss'
import { useShareAppMessage } from '@tarojs/taro'
import {IconFont} from "@nutui/icons-vue-taro";
const showTips = ref(false);
const visible = ref(false);
const type = ref('0');
let showShare = ref(false);
const url = ref('https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png');
const useAppEnv = useAppEnvStore();
/*用户信息*/
const UserInfo = ref({})
const UserVip = ref('')
const keywords = ref('')
const page = ref(1);
const page_size = ref(30);
const groupid = ref('')
const sort = ref('0')
const dataList = ref([])
const bookValue = ref('1')
const showSet = ref(false)
const onCancel = () => {
  console.log('event cancel');
};
const onOk = () => {
  console.log('event ok');
};
const baseClick = () => {
  visible.value = true;
};
const tabClick = (e) => {
  type.value = e.paneKey
  page.value = 1
  switch (e.paneKey){
    case '0':
      getList()
      break;
    case '11':
      getList()
      break;
    case '3':
      getBookInfo()
      break;
    case '4':
      getMaterial()
        break;
    case '5':
      getRecycle()
        break;
    default:
      getList()
  }
}
const openTips = () => {
  console.log('showTips')
  showTips.value = true;
};
const shareLink = (item) => {
  console.log('shareLink')
  showShare.value = true;

};
useShareAppMessage((res) => {
  if (res.from === 'button') {
    // 来自页面内转发按钮
    return {
      title: '我的分享标题',
      path: '/pages/index/index',
      imageUrl: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      success() {
        // 分享成功后的回调处理
      },
      fail(err) {
        // 分享失败后的回调处理
      },
    };
  }
  return {
    title: '自定义转发标题',
    path: '/page/user?id=123',
  }
})
onMounted(() => {
  getUserInfo();
  getList()
})
/*获取用户信息*/
const getUserInfo = () => {
  console.log('getUserInfo')
  return  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_user_info',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uid: '39'
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      UserInfo.value = res.data.data;
      UserVip.value = res.data.data.all.isvip;
      UserInfo.value.username = '建E网235647';
      // time_format(res.data.data.all.vip_endtime)
      console.log('UserInfo', UserInfo.value,UserVip.value)
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
/*时间戳*/
function time_format(time) {
  // 判断时间戳长度并进行相应处理（将非毫秒级时间戳转换为毫秒级）
  let tme;
  if (time.toString().length === 13) { // 时间戳为毫秒级别
    tme = new Date(time);
  } else { // 时间戳为秒级别，需要乘以1000转换为毫秒级别
    tme = new Date(time * 1000);
  }
  const Y = tme.getFullYear();
  const M = (tme.getMonth() + 1).toString().padStart(2, '0');
  const D = tme.getDate().toString().padStart(2, '0');
  const h = tme.getHours().toString().padStart(2, '0');
  const m = tme.getMinutes().toString().padStart(2, '0');
  const s = tme.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${Y}-${M}-${D}`;
  UserInfo.value.all.vip_endtime = formattedTime;
}
const openInternet = () => {
  Taro.request({
        url: ' https://vr.justeasy.cn/xcx/pano/get_micro',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: {
          uid: '39'
        },
      }
  ).then((res) => {
    if (res.statusCode === 200) {
      Taro.navigateTo({
        url: `/pages/webview/index?url=${res.data.data.url}`
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
  console.log('openInternet')
}
/*获取列表*/
/*获取用户信息*/
const getList = () => {
  console.log('getList')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_my_pano_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      page: page.value,
      page_size: page_size.value,
      groupid: groupid.value,
      sort: sort.value,
      keywords: keywords.value,
      type: type.value,
      uid: '39'
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      dataList.value = res.data.data;
      console.log('dataList', dataList.value)
    } else {
      throw new Error('Failed to fetch data');
    }
  });
}
const bookinfoList = ref([])
const bookingPage = ref(1)
const bookingType = ref(1)
const bookData = ref([])
/*预约信息*/
const getBookInfo = () => {
    console.log('getBookInfo')
    Taro.request({
      url: 'https://vr.justeasy.cn/xcx/pano/get_my_pano_list',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        page:bookingType.value,
        type: bookingType.value,
        uid: '39'
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        bookData.value = res.data.data;
        console.log('dataList', dataList.value)
      } else {
        throw new Error('Failed to fetch data');
      }
    });
}
/* 素材库*/
const materialPage = ref(1)
const materialType = ref('-1')
const materialKeywords = ref('')
const materialList= ref([])
const getMaterial = () => {
  console.log('getMaterial',materialType.value)
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/scene_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      page: materialPage.value,
      type: materialType.value,
      keywords: materialKeywords.value,
      uid: '39'
    },
  }).then((res) =>{
    if (res.statusCode === 200) {
      materialList.value = res.data.data;
      console.log('materialList',materialList.value)
    } else {
      throw new Error('Failed to fetch data');
    }
  })
}
/*回收站*/
const recyclePage = ref(1)
const recyclePage_size = ref('20')
const recycleList = ref([])
const getRecycle = () => {
  console.log('getRecycle')
  Taro.request({
    url: ' https://vr.justeasy.cn/xcx/pano/recycle_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      page: recyclePage.value,
      page_size: recyclePage_size.value,
      uid: '39'
    },
    }).then((res) => {
      if (res.statusCode === 200) {
        recycleList.value = res.data.data.list;
        console.log('recycleList',recycleList.value)
      } else {
        throw new Error('Failed to fetch data');
      }
    });
}
</script>
