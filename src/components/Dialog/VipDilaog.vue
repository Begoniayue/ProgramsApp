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
    url: '/pages/Recharge/index',
  })
}
</script>

<template>
  <nut-dialog
      :visible="props.dialogVisible"
      @ok="onOk"
      @cancel="onCancel"
      ok-text="立即充值"
  >
    <view>
      该功能为建E全景 VIP 权益开通 VIP 即可使用
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>