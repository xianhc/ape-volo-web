<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="closeDialog"
    :show-close="false"
    :title="getFormTitle()"
    width="600px"
  >
    <el-form ref="settingForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="数据值" prop="value">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio
          border
          v-for="item in props.statusTypeOption"
          :key="item.id"
          v-model="form.enabled"
          :label="strToBool(item.value)"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          placeholder="请输入"
          :rows="5"
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
  import { strToBool } from '@/utils/converter'

  const props = defineProps({
    statusTypeOption: {
      type: Array,
      required: true
    }
  })

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

  const settingForm = ref(null)
  const rules = ref({
    name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
    value: [{ required: true, message: '请输入数据值', trigger: 'blur' }],
    enabled: [{ required: true, message: '请选择状态', trigger: 'blur' }]
  })
  // 验证表单并保存
  const handleSave = () => validateAndSave(settingForm.value)
</script>
