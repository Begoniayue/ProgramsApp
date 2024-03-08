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
  <nut-dialog title="全景作者" :visible="props.dialogVisible" @cancel="onCancel" @ok="onOk">
    <view>
      <nut-input v-model="currentText" placeholder="请输入全景作者"/>
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>
