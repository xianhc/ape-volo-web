<template>
  <el-dialog
    :model-value="props.showUpdatePassPanel"
    title="修改密码"
    width="600px"
    @close="clearPasswordAndHide"
  >
    <el-form
      ref="modifyPwdForm"
      :model="pwdModify"
      :rules="rules"
      label-width="100px"
      class="py-4"
    >
      <el-form-item label="原密码" prop="oldPass">
        <el-input
          v-model="pwdModify.oldPass"
          placeholder="请输入"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input
          v-model="pwdModify.newPass"
          placeholder="请输入"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass">
        <el-input
          v-model="pwdModify.confirmPass"
          placeholder="请输入"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="doSubmit">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { editUserPass } from '@/api/permission/user'
  import { useUserStore } from '@/pinia/modules/user'

  const userStore = useUserStore()

  const modifyPwdForm = ref(null)
  const pwdModify = ref({})

  const props = defineProps({
    showUpdatePassPanel: {
      type: Boolean,
      required: true
    }
  })

  const emit = defineEmits(['update:showUpdatePassPanel'])

  const handleCancel = () => {
    emit('update:showUpdatePassPanel', false)
    clearPassword()
  }

  const clearPasswordAndHide = () => {
    emit('update:showUpdatePassPanel', false)
    clearPassword()
  }

  const confirmPass = (rule, value, callback) => {
    if (value) {
      if (pwdModify.value.newPass !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    } else {
      callback(new Error('请再次输入密码'))
    }
  }

  const rules = reactive({
    oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
    newPass: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPass: [{ required: true, validator: confirmPass, trigger: 'blur' }]
  })

  const clearPassword = () => {
    pwdModify.value = {
      oldPass: '',
      newPass: '',
      confirmPass: ''
    }
    modifyPwdForm.value?.clearValidate()
  }

  const doSubmit = async () => {
    modifyPwdForm.value.validate((valid) => {
      if (valid) {
        editUserPass({
          oldPass: pwdModify.value.oldPass,
          newPass: pwdModify.value.newPass,
          confirmPass: pwdModify.value.confirmPass
        }).then(() => {
          ElMessage.success('更新密码成功')
          emit('update:showUpdatePassPanel', false)
          userStore.LoginOut()
        })
      }
    })
  }
</script>
