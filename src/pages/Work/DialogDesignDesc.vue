<script setup>
import {ref, defineEmits} from "vue";

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
  emit('cancel')
}
const onOk = () => {
  emit('ok', currentText.value)
  emit('cancel')
}
</script>

<template>
  <nut-dialog title="作品标题" :visible="props.dialogVisible" @cancel="onCancel" @ok="onOk">
    <view>
      <nut-textarea v-model="currentText" placeholder="请输入设计说明" limit-show :max-length="50"/>
    </view>
  </nut-dialog>

</template>

<style scoped>

</style>
