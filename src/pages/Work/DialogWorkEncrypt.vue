<script setup>
import {ref, defineEmits, watch} from "vue";
import Taro from "@tarojs/taro";

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
  const passwordRegex = /^[0-9]{6}$/;
  if (currentEncryptFlag.value==='1' && currentPassword.value === ''){
    return Taro.showToast({
      title: '请输入密码',
      icon: 'none'
    })
  }
  if (currentEncryptFlag.value==='1' && !passwordRegex.test(currentPassword.value)){
    return Taro.showToast({
      title: '请输入6位数字密码',
      icon: 'none'
    })
  }
  emit('ok', currentPassword.value,currentEncryptFlag.value)
  emit('cancel')
}
watch(() => props.encryptFlag, (encryptFlag) => {
  console.log(encryptFlag)
  currentEncryptFlag.value = encryptFlag === '0' ? encryptFlag : '1';
});

watch(() => props.password, (password) => {
  currentPassword.value = props.encryptFlag === '0' ? '' : password;
  console.log(password, 'currentPassword','currentPassword')
});
</script>

<template>
  <nut-dialog title="作品加密" :visible="props.dialogVisible" @cancel="onCancel" @ok="onOk">
    <view>
      <nut-radio-group v-model="currentEncryptFlag" direction="horizontal">
        <nut-radio label="1">开启</nut-radio>
        <nut-radio label="0">关闭</nut-radio>
      </nut-radio-group>
      <nut-input v-if="currentEncryptFlag === '1'" v-model="currentPassword" placeholder="请输入加密密码"/>
    </view>
  </nut-dialog>
</template>

<style scoped>

</style>
