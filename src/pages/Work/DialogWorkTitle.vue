<script setup>
import {ref, defineEmits,watch} from "vue";
import Taro from "@tarojs/taro";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
})
const currentText = ref(props.title)
const emit = defineEmits(['cancel', 'ok'])
const onCancel = () => {
  emit('cancel')
}
const onOk = () => {
  if (currentText.value === ''){
    return Taro.showToast({
      title: '作品标题不能为空',
      icon: 'none',
      duration: 2000
    })
  }
  emit('ok', currentText.value)
  emit('cancel')
}
watch(() => props.title, (newTitle) => {
  currentText.value = newTitle;
});
</script>

<template>
  <nut-dialog title="作品标题" :visible="props.dialogVisible" @cancel="onCancel" @ok="onOk">
    <view>
      <nut-input v-model="currentText" placeholder="请输入作品标题"/>
    </view>
  </nut-dialog>

</template>

<style scoped>

</style>
