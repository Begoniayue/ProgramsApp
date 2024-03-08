<script setup>
import {ref, defineEmits} from "vue";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  encryptFlag: {
    type: String,
    default: '1'
  },
})
const currentEncryptFlag = ref(props.encryptFlag)
const currentPassword = ref(props.password)
const emit = defineEmits(['cancel', 'ok'])
const onCancel = () => {
  emit('cancel')
}
const onOk = () => {
  emit('ok', currentPassword.value,currentEncryptFlag.value)
  emit('cancel')
}
</script>

<template>
  <nut-dialog title="作品加密" :visible="props.dialogVisible" @cancel="onCancel" @ok="onOk">
    <view>
      <nut-radio-group v-model="currentEncryptFlag" direction="horizontal">
        <nut-radio label="1">开启</nut-radio>
        <nut-radio label="2">关闭</nut-radio>
      </nut-radio-group>
      <nut-input v-if="currentEncryptFlag === '1'" v-model="currentPassword" placeholder="请输入加密密码"/>
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>
