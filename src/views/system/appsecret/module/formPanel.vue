<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="closeDialog"
    :show-close="false"
    :title="getFormTitle()"
    width="600px"
  >
    <el-form
      ref="appSecretForm"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="应用Id" prop="appId">
        <el-input
          v-model="form.appId"
          :disabled="true"
          placeholder="系统自动生成"
        />
      </el-form-item>
      <el-form-item label="应用密钥" prop="appSecretKey">
        <el-input
          v-model="form.appSecretKey"
          :disabled="true"
          placeholder="系统自动生成"
        />
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="form.appName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSave"
          >保存</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, inject } from 'vue'

  // 注入crud
  const crud = inject('crud')
  const {
    form,
    dialogVisible,
    loading,
    closeDialog,
    validateAndSave,
    getFormTitle
  } = crud

  const appSecretForm = ref(null)
  const rules = ref({
    appName: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
  })
  // 验证表单并保存
  const handleSave = () => validateAndSave(appSecretForm.value)
</script>
