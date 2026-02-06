<template>
  <el-drawer
    v-model="dialogVisible"
    :size="appStore.drawerSize"
    :before-close="closeDialog"
    :show-close="false"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg">{{ getFormTitle() }}</span>
        <div>
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSave"
            >确 定</el-button
          >
        </div>
      </div>
    </template>

    <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="分组" prop="group">
        <el-select v-model="form.group" placeholder="Api分组" clearable>
          <el-option
            v-for="item in props.apiGroupOption"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="请求Url" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-select v-model="form.method" placeholder="请求方法" clearable>
          <el-option
            v-for="item in props.httpMethodOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { useAppStore } from '@/pinia'
  import { ref, inject } from 'vue'

  const appStore = useAppStore()

  const props = defineProps({
    httpMethodOption: {
      type: Array,
      required: true
    },
    apiGroupOption: {
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

  const apiForm = ref(null)
  const rules = ref({
    group: [{ required: true, message: '请选择', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    url: [{ required: true, message: '请输入请求路径', trigger: 'blur' }],
    method: [{ required: true, message: '请选择', trigger: 'blur' }]
  })
  // 验证表单并保存
  const handleSave = () => validateAndSave(apiForm.value)
</script>
