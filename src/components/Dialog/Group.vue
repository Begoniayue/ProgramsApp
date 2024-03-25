<script setup>
import {ref, defineEmits} from "vue";
import Taro from "@tarojs/taro";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
})
const currentText = ref(props.text)
const emit = defineEmits(['cancel', 'ok'])
const onCancel = () => {
  console.log('取消')
  emit('cancel')
}
const onOk = () => {
  Taro.navigateTo({
    url: `/pages/webview/index?url=https://jeapp.justeasy.cn/vr/rechargeVip.html`,
  })
}
</script>

<template>
  <nut-dialog
      :visible="props.dialogVisible"
      @ok="onOk"
      @cancel="onCancel"
      title="分组筛选" class="sift-dailog"
  >
    <view class="check-wrap">
      <nut-radio-group v-model="groupid" class="home-radio">
        <nut-radio :label="item.groupid" shape="button" v-for="item in siftList" :key="item.id" class="readio-btn">{{ item.name }}</nut-radio>
      </nut-radio-group>
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>