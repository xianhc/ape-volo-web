<template>
  <el-drawer
    v-model="dialogVisible"
    :size="1200"
    :before-close="closeDialog"
    :show-close="false"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg">{{ getFormTitle() }}</span>
        <div>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSave"
            >保存</el-button
          >
        </div>
      </div>
    </template>

    <el-form
      ref="emailTemplateForm"
      :model="form"
      :rules="rules"
      :inline="true"
      label-width="120px"
      label-position="right"
      class="grid grid-cols-2"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="邮件主题" prop="subject">
        <el-input v-model="form.subject" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="发送邮箱" prop="emailAccountId">
        <el-select
          style="width: 100%"
          v-model="form.emailAccountId"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.emailAccountOption"
            :key="item.id"
            :label="item.displayName"
            :value="Number(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio
          border
          v-for="item in props.statusTypeOption"
          :key="item.id"
          v-model="form.enabled"
          :value="strToBool(item.value)"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        class="col-span-2"
        label="抄送邮箱"
        prop="bccEmailAddresses"
      >
        <el-input
          v-model="form.bccEmailAddresses"
          placeholder="多个邮箱都英文隔开"
        />
      </el-form-item>
      <el-form-item class="col-span-2" label="邮件内容" prop="body">
        <el-input
          v-model="form.body"
          placeholder="请输入"
          :rows="20"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { ref, inject } from 'vue'
  import { strToBool } from '@/utils/converter'

  const props = defineProps({
    statusTypeOption: {
      type: Array,
      required: true
    },
    emailAccountOption: {
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

  const emailTemplateForm = ref(null)
  const rules = ref({
    name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
    subject: [{ required: true, message: '请输入邮件主题', trigger: 'blur' }],
    body: [{ required: true, message: '请输入邮件内容', trigger: 'blur' }],
    emailAccountId: [{ required: true, message: '请选择', trigger: 'blur' }],
    enabled: [{ required: true, message: '请选择', trigger: 'blur' }]
  })

  // 验证表单并保存
  const handleSave = () => validateAndSave(emailTemplateForm.value)
</script>
