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
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="tenantForm" :model="form" :rules="rules" :validate-on-rule-change="true" :inline="true"
             label-width="120px"
             label-position="right" class="grid grid-cols-2">
      <el-form-item label="租户类型" class="col-span-2" prop="tenantType">
        <el-select
          style="width: 100%"
          v-model="form.tenantType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.tenantTypeOption"
            :key="item.value"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="租户编号" prop="tenantId">
        <el-input v-model="form.tenantId" oninput="value=value.replace(/[^0-9]/g,'')" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item
        label="DB类型"
        prop="dbType"
        v-if="form.tenantType===2"
      >
        <el-select
          style="width: 260px"
          v-model="form.dbType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.dbTypeOption"
            :key="item.value"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="configId" v-if="form.tenantType===2">
        <template #label>
          <div>
            <span>数据库标识</span>
            <el-tooltip
              content="注：数据库唯一配置标识，用于区分不同的数据库配置"
              placement="top"
              effect="light"
            >
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="form.configId" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="数据库链接" prop="connectionString" class="col-span-2" v-if="form.tenantType===2 &&  form.dbType!==2">
        <el-input v-model="form.connectionString" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="描述" prop="description" class="col-span-2">
        <el-input
          v-model="form.description"
          placeholder="请输入"
          :rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { ref, inject } from 'vue'
  import { useAppStore } from '@/pinia'
  import { QuestionFilled } from '@element-plus/icons-vue'


  const appStore = useAppStore()

  const props = defineProps({
    tenantTypeOption: {
      type: Array,
      required: true
    },
    dbTypeOption: {
      type: Array,
      required: true
    }
  })

  // 注入crud
  const crud = inject('crud')
  const { form, dialogVisible, loading, closeDialog, validateAndSave, getFormTitle } = crud

  const tenantForm = ref(null)
  const rules = ref({
    tenantId: [{ required: true, message: '请输入租户编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
    tenantType: [{ required: true, message: '请选择', trigger: 'blur' }],
    dbType: [{ required: true, message: '请选择', trigger: 'blur' }],
    configId: [{ required: true, message: '请输入数据库唯一标识', trigger: 'blur' }],
    connectionString: [{ required: true, message: '请输入数据库链接', trigger: 'blur' }]
  })

  // 验证表单并保存
  const handleSave = () => validateAndSave(tenantForm.value)
</script>


