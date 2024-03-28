<template>
  <view class="home-content">
    <view class="home-top-wrap">
      <view class="user-info-container">
        <view class="avatar-container" v-if="storedUid !== null" @click="loginOutFlag = true">
          <image v-if="UserInfo.avatar!==''" :src="UserInfo.avatar" class="avatar-img"/>
          <image v-else src="../../../images/icon.jpg" class="avatar-img"/>
        </view>
        <view class="avatar-container-uid" v-else>
          <image src="../../../images/icon.jpg" class="avatar-img"/>
          <view class="open-vip" @click="toLogin">请登录</view>
        </view>
        <view class="info-container" v-if="storedUid !== null">
          <view class="user-info" v-if="UserVip === 1">
           <view class="user-name"  @click="loginOutFlag = true">{{ UserInfo.username }}</view>
           <view class="vip-icon"><image src="../../../images/vip.png" /></view>
           <view class="vip-date">(会员到期：{{ UserInfo.all.vip_endtime }})</view>
          </view>
          <view class="user-info" v-else>
            <view class="user-name" @click="loginOutFlag = true">{{ UserInfo.username }}
            </view>
            <view class="open-vip" @click="openVip">开通全景VIP</view>
          </view>
          <!-- 其他用户信息 -->
          <div class="work-capacity">
            <view class="work-text">作品容量：</view>
            <view class="work-count">
              <view class="work-count-total">{{ UserInfo.user_pano_nums }}</view>
              <view class="work-count-text">/{{ UserInfo.total }}</view>
              <view class="work-icon" @click="openTips"> <image src="../../../images/ask.png" /></view>
            </view>
          </div>
          <nut-popup v-model:visible="showTips" position="bottom" closeable :style="{ height: '20%' }">
            <view class="tip-wrap">
              <view class="text">
                <text class="text-bold">会员容量:{{ UserInfo.total }}</text>(限时，会员期可用)
              </view>
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
            :percentage="(Number(UserInfo.user_pano_nums)/UserInfo.total)*100"
            :show-text="false"
            status="active"
            class="progress"
          />
        </view>
      </view>
    </view>
    <view class="home-web-wrap" @click="openInternet">
      <image src="../../../images/web.png"></image>
      <view class="web-btn">点击了解</view>
    </view>
    <!--选项-->
    <view>
<!-- 搜索     -->
      <nut-tabs v-if="storedUid !== null" v-model="type" class="home-tabs" @click="tabClick">
        <nut-tab-pane title="全景图" pane-key="0" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywords" placeholder="搜索全景关键词" :confirm-type="'search'" @search="getList('search')">
              <template #rightout>
                <view class="icon" @click="showSort = true">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/paixu.png"
                  />
                </view>
                <view class="icon" @click="showBatch = true">
                  <image
                      style="width: 24px;height: 24px;"
                      src="../../../images/icon.png"
                  />
                </view>
              </template>
              <template #leftin>  <IconFont name="search"></IconFont> </template>
            </nut-searchbar>
          </view>
          <view class="item" v-if="dataShow">
            <view class="item-list" v-for="(item, index) in dataList" :key="index">
              <view class="left-container" @click="toPreview(item)">
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
                    <view @click="toWorkSetting(item.pano_id,UserVip)">
                      <image class="icon" src="../../../images/set.png"/>
                    </view>
                    <view @click="toMoreWorkSetting(item.pano_id)">
                     <image class="icon" src="../../../images/gengduo.png"></image>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="item-empty" v-else>
            <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
            <view style="font-size: 24rpx">暂无数据~</view>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="平面图" pane-key="11" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywords" placeholder="搜索全景关键词" :confirm-type="'search'" @search="getList('search')">
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
          <view class="item" v-if="dataShow">
            <view class="item-list" v-for="(item, index) in dataList" :key="index">
              <view class="left-container" @click="toPreview(item)">
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
                  </view>
                  <view class="right-set">
                    <view @click="toWorkSetting(item.pano_id,UserVip)">
                      <image class="icon" src="../../../images/set.png"/>
                    </view>
                    <view @click="toMoreWorkSetting(item.pano_id,'0')">
                      <image class="icon" src="../../../images/gengduo.png"></image>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="item-empty" v-else>
            <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
            <view style="font-size: 24rpx">暂无数据~</view>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="预约信息" pane-key="3" class="list-box">
          <nut-tabs v-model="bookValue" @change="getBookList">
            <nut-tab-pane title="全景作品预约" pane-key="1" class="book-list">
              <view class="book-wrap" v-if="dataShow">
                <view class="book-item" v-for="(item, index) in bookData" :key="index">
                  <nut-cell>
                    <template #title>
                      <view class="book-time">{{ item.addtime }}</view>
                        <span>
                          <view class="work-title">
                               <view> 预约人姓名</view>
                              <view> {{ item.nickname }} </view>

                          </view>
                          <view class="work-title">
                               <view> 联系电话</view>
                              <view> {{ item.mobile }} </view>
                          </view>
                        </span>
                      <view class="book-info">{{ item.info }}</view>
                    </template>
                  </nut-cell>
                </view>
              </view>
              <view v-else>
                <view class="item-empty">
                  <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
                  <view style="font-size: 24rpx">暂无数据~</view>
                </view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="微官网预约" pane-key="2" class="book-list">
              <view class="book-wrap" v-if="dataShow">
                <view class="book-item" v-for="(item, index) in bookData" :key="index">
                  <nut-cell>
                    <template #title>
                      <view class="book-time">{{ item.addtime }}</view>
                      <span>
                          <view class="work-title">
                               <view> 预约人姓名</view>
                              <view> {{ item.nickname }} </view>

                          </view>
                          <view class="work-title">
                               <view> 联系电话</view>
                              <view> {{ item.mobile }} </view>
                          </view>
                        </span>
                      <view class="book-info">{{ item.info }}</view>
                    </template>
                  </nut-cell>
                </view>
              </view>
              <view  v-else>
                <view class="item-empty">
                  <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
                  <view style="font-size: 24rpx">暂无数据~</view>
                </view>
              </view>
            </nut-tab-pane>
          </nut-tabs>
        </nut-tab-pane>
        <nut-tab-pane title="素材库" pane-key="4" class="list-box">
          <view class="home-search-wrap">
            <nut-searchbar v-model="keywordsMaterial" placeholder="搜索素材库关键词"  :confirm-type="'search'" @search="getMaterial('search')">
              <template #leftin> <IconFont name="search"></IconFont> </template>
            </nut-searchbar>
          </view>
          <nut-tabs v-model="materialType" align="left" @change="getMaterialList">
            <nut-tab-pane title="原创" pane-key="-1" class="book-list">
              <view class="item" v-if="dataShow">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container" @click="toPreviewMaterial(item)">
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
                      <view class="right-set" @click="delMaterial(item)">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="item-empty" v-else>
                <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
                <view style="font-size: 24rpx;color: #666666">您当前还没有可使用素材,前往全景素材交易购买或升级全景VIP即可免费赠送哦~</view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="已购" pane-key="1" class="book-list">
              <view class="item" v-if="dataShow">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container" @click="toPreviewMaterial(item)">
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
                      <view class="right-set" @click="delMaterial(item)">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="item-empty" v-else>
                <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
                <view  style="font-size: 24rpx;color: #666666">您当前还没有可使用素材,前往全景素材交易购买或升级全景VIP即可免费赠送哦~</view>
              </view>
            </nut-tab-pane>
            <nut-tab-pane title="VIP场景" pane-key="6" class="book-list">
              <view class="item" v-if="dataShow">
                <view class="item-list" v-for="(item, index) in materialList" :key="index">
                  <view class="left-container" @click="toPreviewMaterial(item)">
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
                      <view class="right-set" @click="delMaterial(item)">
                        <IconFont name="del"></IconFont>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="item-empty" v-else>
                <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
                <view  style="font-size: 24rpx;color: #666666">您当前还没有可使用素材,前往全景素材交易购买或升级全景VIP即可免费赠送哦~</view>
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
          <view class="item" v-if="dataShow">
            <view class="item-list" v-for="(item, index) in recycleList" :key="index">
              <view class="left-container">
                <image :src="item.preview" mode="aspectFit" class="image"></image>
              </view>
              <view class="right-container">
                <view class="info-line">
                  <view class="work-title">{{ item.name }}</view>
                </view>
                  <view class="date">删除时间：{{ item.addtime }}</view>
                  <view class="date">失效时间：{{ item.endtime }}</view>
                <view class="info-line">
                  <view class="vide-wrap">
                    <view class="delete" @click="delWork(item)">删除</view>
                    <view class="refer" @click="referWork(item)">恢复</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view v-else>
            <view class="item-empty">
              <image class="empty" src="../../../images/empty.svg" mode="aspectFit"></image>
              <view style="font-size: 24rpx">暂无数据~</view>
            </view>
          </view>
        </nut-tab-pane>
      </nut-tabs>
      <nut-tabs v-else v-model="type" @click="tabClickLogin">
      <nut-tab-pane title="全景图" pane-key="0" class="login-list">您还没有登录哦~ </nut-tab-pane>
      <nut-tab-pane title="平面图" pane-key="11" class="login-list"> 您还没有登录哦~</nut-tab-pane>
      <nut-tab-pane title="预约信息" pane-key="3" class="login-list"> 您还没有登录哦~</nut-tab-pane>
      <nut-tab-pane title="素材库" pane-key="4" class="login-list"> 您还没有登录哦~ </nut-tab-pane>
      <nut-tab-pane title="回收站" pane-key="5" class="login-list"> 您还没有登录哦~ </nut-tab-pane>
    </nut-tabs>
<!--分享-->
      <nut-popup v-model:visible="showShare" position="bottom" :style="{ height: '40%' }" class="popupShare">
        <view class="share-title">直接分享</view>
        <view class="share-wrap">
          <view class="share-item">
            <button class="share-content" open-type="share">
              <view v-if="String(useAppEnv.currentEnv) === 'WEAPP'">
                <image src="../../../images/wei.svg" mode="aspectFit" class="share-icon"></image>
              </view>
              <view v-else>
                <image src="../../../images/douyin.svg" mode="aspectFit" class="share-icon"></image>
              </view>
              <view class="share-type" v-if="String(useAppEnv.currentEnv) === 'WEAPP'">
                微信好友
              </view>
              <view class="share-type" v-else>选择分享方式</view>
            </button>
          </view>
          <view class="share-item" @click="copyLink">
            <view>
              <image src="../../../images/link.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">作品链接</view>
          </view>
          <view class="share-item" @click="shareQcode">
            <view>
              <image src="../../../images/erweima.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">作品二维码</view>
          </view>
        </view>
<!--  vip      -->
        <view class="share-title">你还可以选择（部分功能vip）</view>
        <view class="share-wrap">
          <view class="share-item" v-if="UserVip === 0" @click="vipVisible = true">
            <view>
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
            <view>
              <image src="../../../images/lvlink.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">临时链接</view>
          </view>
          <view class="share-item" v-else @click="showShort = true">
            <view>
              <image src="../../../images/lvlink.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">临时链接</view>
          </view>
          <view class="share-item" v-if="UserVip === 0" @click="vipVisible = true">
            <view>
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
            <view>
              <image src="../../../images/suo.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">作品加密</view>
          </view>
          <view class="share-item" v-else @click="dialogVisibleWorkEncrypt = true">
            <view>
              <image src="../../../images/suo.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">作品加密</view>
          </view>
          <view class="share-item"  v-if="UserVip === 0" @click="vipVisible = true">
            <view>
              <image src="../../../images/vip.svg" mode="aspectFit" class="vip-icon"></image>
            </view>
            <view>
              <image src="../../../images/card.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">生成卡片</view>
          </view>
          <view class="share-item"  @click="ToCard" v-else>
            <view>
              <image src="../../../images/card.svg" mode="aspectFit" class="share-icon"></image>
            </view>
            <view class="share-type" open-type="share">生成卡片</view>
          </view>
        </view>
      </nut-popup>
      <nut-popup v-model:visible="showSet" position="bottom" :style="{ height: '18%' }">
        <nut-cell class="set-pop" v-if="UserVip === 0"  @click="vipVisible = true">
          <view>回收站密码</view>
        </nut-cell>
        <nut-cell class="set-pop" v-else @click="referVisible = true" >
          <view>回收站密码</view>
        </nut-cell>
        <nut-cell class="set-pop"  @click="visible = true">
          <view>清空回收站</view>
        </nut-cell>
      </nut-popup>
      <nut-popup v-model:visible="showSort" position="bottom" :style="{ height: '18%' }">
        <nut-cell class="set-pop" @click="Sort('0')">
          <view >默认</view>
        </nut-cell>
        <nut-cell class="set-pop" @click="Sort('1')">
          <view>修改时间</view>
        </nut-cell>
      </nut-popup>
      <nut-popup v-model:visible="showBatch" position="bottom" :style="{ height: '18%' }">
        <nut-cell class="set-pop" @click="getSift">
          <view >分组筛选</view>
        </nut-cell>
        <nut-cell class="set-pop" @click="goBatch">
          <view>批量操作</view>
        </nut-cell>
      </nut-popup>
      <nut-dialog v-model:visible="showSift"  title="分组筛选" @cancel="SiftonCancel" @ok="SiftonOk" class="sift-dailog">
        <view class="check-wrap">
          <nut-radio-group v-model="groupid" class="home-radio">
            <nut-radio :label="item.groupid" shape="button" v-for="item in siftList" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
          </nut-radio-group>
        </view>
      </nut-dialog>
      <nut-dialog
          title="是否清空回收站"
          v-model:visible="visible"
          @cancel="onCancel"
          @ok="onEmptyOk"
      >
        删除后作品数据清空,无法恢复,请谨慎操作！！！
      </nut-dialog>
      <nut-dialog
          title="是否从回收站中删除"
          v-model:visible="delvisible"
          @ok="ondelOk"
      >
        删除后作品数据清空,无法恢复,请谨慎操作！！！
      </nut-dialog>
      <nut-dialog
          title="回收站密码"
          v-model:visible="referVisible"
          @cancel="onCancel"
          @ok="onRecycleOk"
      >
        <view>
          <nut-radio-group v-model="passwordFlag" direction="horizontal">
            <nut-radio label="1">开启</nut-radio>
            <nut-radio label="0">关闭</nut-radio>
          </nut-radio-group>
          <nut-input v-if="passwordFlag=== '1'" v-model="recycleWord" placeholder="请输入加密密码"/>
        </view>
      </nut-dialog>
<!-- 二维码  -->
      <nut-popup v-model:visible="showQcode" :style="{ padding: '30px 50px' }">
         <image :src="qrcode" class="qrcode-img"></image>
         <view class="save-code" @click="saveImage(qrcode)">保存到相册</view>
      </nut-popup>
<!-- 临时链接  -->
      <nut-dialog title="临时链接" v-model:visible="showShort" @ok="onSaveShort" >
        <view class="short-wrap">
          <view class="short-item">
            <view class="short-item-title">是否开启临时分享:</view>
            <nut-switch v-model="temporaryVal" active-color="#6C6BFC" />
          </view>
          <view class="short-item">
            <view class="short-item-title">设置临时链接分享时间:</view>
            <nut-input-number v-model="minute">
              <template #left-icon>
              </template>
              <template #right-icon>
              </template>
            </nut-input-number>
            <view class="short-item-title">分钟</view>
          </view>
          <view class="short-item">
            <view class="short-item-title">作品中是否显示失效时间:</view>
            <nut-switch v-model="showTime" active-color="#6C6BFC" />
          </view>
          <view class="short-item">限时分享与临时链接功能合并</view>
          <view class="short-item">开启后会生成新的分享链接，不影响原有作品链接</view>
          <view class="short-item">原限时分享可前往PC端设置关闭</view>
        </view>
      </nut-dialog>
<!--  作品加    -->
      <DialogWorkEncrypt
          :dialogVisible="dialogVisibleWorkEncrypt"
          @cancel="onWorkEncryptDialogCancel"
          @ok="onWorkEncryptDialogOk"
          :password="workInfo.pwd_value"
          :encryptFlag="workInfo.pwd_value"
      />
<!-- 生成卡片 -->
      <nut-popup v-model:visible="showCard" closeable close-icon-position="top-right" round>
<!--        <view class="card-wrap">-->
<!--          <view class="card-title">{{ card.title }}</view>-->
<!--          <view class="card-user">-->
<!--            <image :src="card.avatar" mode="aspectFit" class="card-user-img"></image>-->
<!--            {{ card.user_name }}-->
<!--          </view>-->
<!--          <view class="card-content">-->
<!--            <image :src="card.preview" mode="aspectFit" class="card-img"></image>-->
<!--          </view>-->
<!--          <view class="card-footer">-->
<!--            <image :src="card.logo_url" mode="aspectFit" class="card-logo"></image>-->
<!--            <image :src="card.code_url" mode="aspectFit" class="card-code"></image>-->
<!--          </view>-->
<!--        </view>-->
        <view class="card-wrap">
          <image :src="card" mode="aspectFit" class="card-logo"/>
        </view>
        <view class="save-code" @click="saveImage(card)">保存到相册</view>
      </nut-popup>
      <nut-popup v-model:visible="loginOutFlag" position="bottom" :style="{ height: '10%' }">
        <view class="card-wrap" @click="loginOut">
          退出登录
        </view>
      </nut-popup>
      <nut-dialog
          no-cancel-btn
          title="回收站密码"
          v-model:visible="recycleVisible"
          @ok="onrecycleVisibleOk"
          :ok-auto-close="false"
      >
        <view>
          <nut-input  v-model="recyclePassword" placeholder="请输入加密密码"/>
        </view>
      </nut-dialog>
      <nut-dialog
          v-model:visible="vipVisible"
          @ok="openVip"
          ok-text="立即充值"
      >
        <view>
          该功能为建E全景 VIP 权益开通 VIP 即可使用
        </view>
      </nut-dialog>
    </view>
  </view>
</template>
<script setup>
import { useAppEnvStore } from '../../stores/appEnvStore'
import Taro, {useDidShow, useLoad, useReachBottom} from '@tarojs/taro';
import {onMounted, ref} from 'vue';
import './index.scss'
import { useShareAppMessage } from '@tarojs/taro'
import {IconFont} from "@nutui/icons-vue-taro";
import {list} from "postcss";
import DialogWorkEncrypt from "../Work/DialogWorkEncrypt.vue";
import CryptoJS from "crypto-js";
import {useUserStore} from "../../stores/userStore";
import generateAndEncryptToken from '../../util/sort'

const qrcode = ref('');
const showTips = ref(false);
const visible = ref(false);
const referVisible = ref(false);
const referWorkVisible = ref(false);
const passwordFlag = ref('0');
const password = ref('');
const recycleWord = ref('');
const type = ref('0');
let showShare = ref(false);
let recycleVisible = ref(false);
let vipVisible = ref(false);
let workInfo = ref({});
let recyclePassword = ref('');
const url = ref('https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png');
const useAppEnv = useAppEnvStore();
/*用户信息*/
const UserInfo = ref({})
const UserVip = ref(0)
const keywords = ref('')
const keywordsMaterial = ref('')
const keywordsPlane= ref('')
const temporaryVal = ref(false)
const page = ref(1);
const page_size = ref(30);
const groupid = ref('0')
const sort = ref('0')
const dataList = ref([])
const bookValue = ref('1')
const minute = ref('10')
const showSet = ref(false)
const showSort = ref(false)
const showBatch = ref(false)
const showSift = ref(false)
const showQcode = ref(false)
const showShort = ref(false)
const showTime = ref(false)
const showCard = ref(false)
const delvisible = ref(false)
const dataShow = ref(true)
const onCancel = () => {
  console.log('event cancel');
};
const onrecycleVisibleOk = () => {
  const data = {
    pwd: recyclePassword.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/check_recycle',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      recycleVisible.value = false;
      Taro.showToast({
        title:'验证成功'
      })
    } else {
      recycleVisible.value = true;
      Taro.showToast({
        icon:"error",
        title:res.data.msg
      })
    }
  });
};
const onRecycleOk = () => {
  const data = {
    pwd: recycleWord.value,
    open: passwordFlag.value,
    uesr_token:Taro.getStorageSync('userUid'),
}
const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pwd_recycle',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      Taro.showToast({
        title:'设置成功'
      })
      referVisible.value = false;
    } else {
      Taro.showToast({
        title:res.data.msg
      })
      throw new Error('Failed to fetch data');
    }
  });
};
const onEmptyOk = () => {
  const data = {
    uesr_token:Taro.getStorageSync('userUid'),
}
const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/empty_recycle',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      Taro.showToast({
        title:'清空成功'
      })
      visible.value = false;
      showSet.value = false;
      recycleList.value = [];
      getRecycleList();
    } else {
      Taro.showToast({
        title:res.data.msg
      })
    }
  });
};
const onSaveShort = () => {
  const data = {
    panoid: shareObject.value.pano_id,
    is_open: temporaryVal.value ? 1 : 0,
    times: minute.value,
    is_show:showShort.value ? 1 : 0,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_temp_url',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      Taro.setClipboardData({
        data: res.data.data,
        success: function (res) {
        }
      })
    } else {
      throw new Error('Failed to fetch data');
    }
  });
};
const SiftonCancel = () => {
};
const SiftonOk = () => {
  dataList.value = []
  getList()
  showBatch.value = false
};
const baseClick = () => {
  visible.value = true;
};
const tabClick = (e) => {
  dataShow.value = true
  type.value = e.paneKey
  page.value = 1
  materialPage.value = 1
  recyclePage.value = 1
  bookingPage.value = 1
  keywords.value = ''
  keywordsMaterial.value = ''
  dataList.value = []
  bookinfoList.value = []
  bookData.value = []
  materialList.value = []
  recycleList.value = []
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
      recycleVisibleFlag.value = true
      recyclePassword.value = ''
      getRecycle()
        break;
    default:
      getList()
  }
}
const tabClickLogin = () => {
  dataShow.value = false
  Taro.showToast({
    title: '请先登录',
    icon: 'none',
    duration: 2000
  })
}
const openTips = () => {
  showTips.value = true;
};
const shareObject = ref({})
const urlToFriend = ref('')
const shareLink = (item) => {
  showShare.value = true;
  shareObject.value = item
  urlToFriend.value = item.detail_url
};
const toWorkSetting = (panoid,UserVip) => {
  Taro.navigateTo({
    url: `/pages/Work/index?panoid=${panoid}&UserVip=${UserVip}`,
  })
}
const openVip = () => {
  Taro.navigateTo({
    url: '/pages/Recharge/index',
  })
}
const toMoreWorkSetting = (panoid,Vip) => {
  const vip = UserVip.value
  Taro.navigateTo({
    url: `/pages/MoreWork/index?panoid=${panoid}&UserVip=${vip}`,
  })
}
const goBatch = () => {
  showBatch.value = false;
  Taro.navigateTo({
    url: `/pages/BatchOperate/index?type=${type.value}`,
  })
};
useShareAppMessage((res) => {
  console.log(urlToFriend.value,'urlToFriend.value')
  if (res.from === 'button') {
    // 来自页面内转发按钮
    return {
      title: shareObject.value.name,
      path: `/pages/webview/index?url=${urlToFriend.value}`,
      imageUrl: shareObject.value.preview,
      success() {
        console.log()
        // 分享成功后的回调处理
      },
      fail(err) {
        // 分享失败后的回调处理
      },
    };
  }
  // return {
  //   title: '自定义转发标题',
  //   path: '/page/user?id=123',
  // }
})
const storedUid = ref(null)
const userStore = useUserStore();

onMounted(()=>{
})
useDidShow(() => {
  dataShow.value = true
  keywords.value = ''
  page.value = 1
  materialPage.value = 1
  recyclePage.value = 1
  bookingPage.value = 1
  keywordsMaterial.value = ''
  recyclePassword.value = ''
  recycleList.value = []
  bookData.value = []
  bookinfoList.value = []
  materialList.value = []
  dataList.value = []
  const userUid = Taro.getStorageSync('userUid');
  if (userUid !== '') {
    storedUid.value = userUid;
  }else {
    storedUid.value = null
  }
  getUserInfo();
  getList();
})
/*获取用户信息*/
const getUserInfo = () => {
  const data = {
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  return  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_user_info',
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      UserInfo.value = res.data.data;
      UserVip.value = res.data.data.is_vip;
      UserInfo.value.username = '建E网235647';
      /*放入userstore中 并将UserVip的值放到内存*/
      Taro.setStorageSync('UserVip', UserVip.value);
      time_format(res.data.data.all.vip_endtime)
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
  const data = {
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
        url: 'https://vr.justeasy.cn/xcx/pano/get_micro',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: {
          uesr_token:Taro.getStorageSync('userUid'),
          token: encryptedToken
        },
      }
  ).then((res) => {
    if (res.data.status=== 200 && res.data.data.url) {
      Taro.navigateTo({
        url: `/pages/webview/index?url=${res.data.data.url}`
      })
    } else {
      Taro.navigateTo({
        url: `/pages/webview/index?url=https://jeapp.justeasy.cn/vr/upgrade.html`
      })
    }
  });
}
/*获取列表*/
const Sort = (num) => {
  dataList.value = []
  sort.value = num
  getList()
  showSort.value = false
}
/*获取用户信息*/
const getList = (search) => {
  Taro.showLoading({
    title: '加载中',
  })
  if (search === 'search'){
    page.value = 1
  }
  const data = {
    page: page.value,
    page_size: page_size.value,
    groupid: groupid.value,
    sort: sort.value,
    keywords: keywords.value,
    type: type.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_my_pano_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
     ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (Number(res.data.status) === 200) {
      Taro.hideLoading();
      if (search === 'search'){
        dataShow.value = res.data.data.length > 0;
        return dataList.value = res.data.data;
      }
      dataList.value = [...dataList.value, ...res.data.data];
      console.log(dataList.value.length)
      dataShow.value =  dataList.value.length > 0;
      console.log(dataList.value.length, 'dataListShow.length')
    } else {
      Taro.hideLoading();
      if (res.data.msg === '请先登录') {
        Taro.showToast({
          title: '请先登录',
          icon: 'none',
          duration: 2000
        })
        Taro.removeStorageSync('userUid');
        // Taro.navigateTo({
        //   url: '/pages/Login/index'
        // })
      }
    }
  });
}
const bookinfoList = ref([])
const bookingPage = ref(1)
const bookingType = ref(1)
const bookData = ref([])
/*预约信息*/
const getBookInfo = (type) => {
  Taro.showLoading({
    title: '加载中...',
  });
  const data = {
    page:bookingPage.value,
    type: bookValue.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
    Taro.request({
      url: 'https://vr.justeasy.cn/xcx/pano/subscribe_info',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        ...data,
        token: encryptedToken
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        bookData.value = [...bookData.value, ...res.data.data];
        bookData.value.length === 0 ? dataShow.value = false : dataShow.value = true;
        Taro.hideLoading();
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
const getMaterialList = (search) => {
  materialList.value = []
  getMaterial()
}
const getBookList = (search) => {
  bookinfoList.value = []
  bookData.value = []
  bookingPage.value = 1
  getBookInfo()
}
const getMaterial = (search) => {
  Taro.showLoading({
    title: '加载中...',
  });
  if (search === 'search'){
    page.value = 1;
  }
  const data = {
    page: materialPage.value,
    type: materialType.value,
    keywords: keywordsMaterial.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/scene_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) =>{
    if (res.statusCode === 200) {
      Taro.hideLoading();
      if (search === 'search'){
       return materialList.value = res.data.data;
      }
      materialList.value = [...materialList.value, ...res.data.data];
      materialList.value.length === 0 ? dataShow.value = false : dataShow.value = true;
    } else {
      throw new Error('Failed to fetch data');
    }
  })
}
/*回收站*/
const recyclePage = ref(1)
const recyclePage_size = ref('20')
const recycleList = ref([])
const recycleVisibleFlag = ref(false)
const getRecycle = () => {
  const data = {
    page: recyclePage.value,
    page_size: recyclePage_size.value,
    keywords: materialKeywords.value,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  console.log('getRecycle')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/recycle_list',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
    }).then((res) => {
      if (res.statusCode === 200) {
        recycleList.value = [...recycleList.value, ...res.data.data.list];
        if (recycleVisibleFlag.value){
          recycleVisible.value = res.data.data.recycle.is_open === '1'
        }
        recycleList.value.length === 0 ? dataShow.value = false : dataShow.value = true;
        passwordFlag.value = res.data.data.recycle.is_open === '1' ? '1' : '0'
        recycleWord.value = res.data.data.recycle.pwd
        console.log('recycleList',recycleList.value,recycleVisible.value)
      } else {
      }
    });
}
const siftList = ref([])
const getSift = () => {
  const data = {
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  console.log('getSift')
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_group',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      uesr_token:Taro.getStorageSync('userUid'),
      token:encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      siftList.value = res.data.data;
      showSift.value = true
    }
  })
}
const copyLink = () =>{
  console.log('copyLink',shareObject.value)
  Taro.setClipboardData({
    data: shareObject.value.detail_url,
  })
}
const shareQcode = () => {
  const data = {
    panoid: shareObject.value.pano_id,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_qrcode',
    method:'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      qrcode.value = res.data.data.qrcode;
      console.log('qrcode',qrcode.value,res.data.data)
      showQcode.value = true
    }
  })
}
const saveImage = (item) =>{
  Taro.downloadFile({
    url: item, //仅为示例，并非真实的资源
    success: function (res) {
      if (res.statusCode === 200) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, // 使用下载得到的临时文件路径字符串
          success() {
            Taro.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 2000
            });
            showQcode.value = false
            showCard.value = false
            console.log('成功保存到相册');
          },
          fail(err) {
            Taro.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000
            });
            console.error('保存图片到相册失败：', err);
          }
        });
      } else {
        console.error('下载图片失败');
      }
    },
    fail: function () {
      console.error('下载图片失败');
    }
  })
}
const dialogVisibleWorkEncrypt = ref(false)
const onWorkEncryptDialogCancel = () => {
  dialogVisibleWorkEncrypt.value = false
}
const onWorkEncryptDialogOk = (currentPassword,currentEncryptFlag) => {
  const data = {
    panoid: shareObject.value.pano_id,
    pwd: currentPassword,
    is_encrypt: currentEncryptFlag.value,
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/set_pwd',
    method:'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token:encryptedToken,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      dialogVisibleWorkEncrypt.value = false
      Taro.showToast({
        title: '保存成功'
      })
    }
  })
}
const card = ref({})
const ToCard = () =>{
  const data = {
    panoid: shareObject.value.pano_id,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  showCard.value = true
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/get_card',
    method:'GET',
    header: {
      'content-type': 'application/json'
    },
    data: {
     ...data,
      uesr_token:Taro.getStorageSync('userUid'),
      token: encryptedToken
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      card.value = res.data.data;
    }
  })
}
const toLogin = () => {
  Taro.navigateTo({
    url: '/pages/Login/index'
  })
}
const loginOutFlag = ref(false)
const loginOut = async () => {
  try {
    await Taro.removeStorageSync('userUid');
    storedUid.value = null
    loginOutFlag.value = false;
    Taro.removeStorageSync('materialList');
  } catch (error) {
    console.error('登出失败', error);
  }
}
const delMaterial = (item) =>{
  Taro.showLoading({
    title:'加载中'
  })
  const data = {
    sceneid: item.sceneid,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/del_scene',
    method:'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      Taro.hideLoading()
      Taro.showToast({
        title: '删除成功'
      })
      materialList.value = []
      getMaterial()
    }
  })
}
const ondelOk = (item) =>{
  const data = {
    panoid: delItem.value.panoid,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/del_recycle',
    method:'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      Taro.showToast({
        title: '删除成功'
      })
      recycleVisibleFlag.value = false
      getRecycle()
    }
  })
}
const referWork = (item) => {
  const data = {
    panoid: item.panoid,
    uesr_token:Taro.getStorageSync('userUid'),
  }
  const secret = 'YYlk*sdf000&&af#~@&987xdSJFF**sfsh';
  const encryptedToken = generateAndEncryptToken(data, secret);
  Taro.request({
    url: 'https://vr.justeasy.cn/xcx/pano/reset_recycle',
    method:'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      ...data,
      token: encryptedToken
    },
  }).then((res) => {
    if (res.data.status === 200) {
      recycleList.value = []
      Taro.showToast({
        title: '恢复成功'
      })
      getRecycle()
    }
  })
}
const delItem = ref({})
const delWork = (item) => {
  recycleList.value = []
  delvisible.value = true
  delItem.value = item
}

function saveToAlbum(tempFilePath) {
  return new Promise((resolve, reject) => {
    Taro.saveImageToPhotosAlbum({
      filePath: card.value,
      success: () => resolve(),
      fail: err => reject(err),
    });
  });
}

const toPreview = (item) => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=${item.detail_url}`
  })
}
const toPreviewMaterial = (item) => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=${item.url}`
  })
}
useReachBottom(() => {
  switch (type.value){
    case '0':
      page.value++
      getList()
      break;
    case '11':
      page.value++
      getList()
      break;
    case '3':
      bookingPage.value++
      getBookInfo()
      break;
    case '4':
      materialPage.value++
      getMaterial()
      break;
    case '5':
      recyclePage.value++
      getRecycle()
      break;
    default:
      getList()
  }
});
const getInfo = () => {
  const data = {
    panoid: shareObject.value.pano_id,
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
    }
  })
}
</script>
