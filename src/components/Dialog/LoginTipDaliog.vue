<script setup>
import {ref, defineEmits} from "vue";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
})
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
      no-cancel-btn
      content="请先登录,否则数据可能会丢失哦。"
      @ok="onOk"
  >
  </nut-dialog>
</template>

<style scoped>

</style>