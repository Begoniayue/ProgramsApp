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
  emit('ok')
}
</script>

<template>
  <nut-dialog
      :visible="props.dialogVisible"
      @ok="onOk"
      @cancel="onCancel"
  >
    <view>
      会员删除作品将在回收站保留30天，非会员保留15天
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>