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
    <el-form
      ref="userForm"
      :model="form"
      :rules="rules"
      :inline="true"
      label-width="120px"
      label-position="right"
      class="grid grid-cols-2"
    >
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.genderCode">
          <el-radio
            border
            v-for="item in props.genderOption"
            :key="item.id"
            :value="Number(item.value)"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.enabled" :disabled="false">
          <el-radio
            border
            v-for="item in props.statusOption"
            :key="item.id"
            :value="strToBool(item.value)"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="department" label="部门">
        <el-cascader
          v-model="form.dept.id"
          style="width: 100%"
          :options="departmentOption"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'id',
            emitPath: false
          }"
          :show-all-levels="false"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="租户">
        <el-select
          style="width: 100%"
          v-model="form.tenantId"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.tenantOption"
            :key="item.tenantId"
            :label="item.name"
            :value="Number(item.tenantId)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="roles" class="col-span-2">
        <el-select
          style="width: 100%"
          v-model="form.roles"
          value-key="id"
          multiple
          clearable
          filterable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.roleOption"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="jobs" class="col-span-2">
        <el-select
          style="width: 100%"
          v-model="form.jobs"
          value-key="id"
          clearable
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          placeholder="请选择"
        >
          <el-option
            v-for="item in props.jobOption"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { useAppStore } from '@/pinia'
  import { inject, ref } from 'vue'
  import { strToBool } from '@/utils/converter'
  import { isvalidPhone } from '@/utils/validate'

  const appStore = useAppStore()

  const props = defineProps({
    statusTypeOption: {
      type: Array,
      required: true
    },
    genderOption: {
      type: Array,
      required: true
    },
    departmentOption: {
      type: Array,
      required: true
    },
    jobOption: {
      type: Array,
      required: true
    },
    roleOption: {
      type: Array,
      required: true
    },
    tenantOption: {
      type: Array,
      required: true
    }
  })

  const validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }

  const rules = ref({
    userName: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '长度在 2 到 20 个字符',
        trigger: 'blur'
      }
    ],
    nickName: [
      { required: true, message: '请输入用户昵称', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '长度在 2 到 20 个字符',
        trigger: 'blur'
      }
    ],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [{ required: true, trigger: 'blur', validator: validPhone }],
    jobs: [
      { required: true, message: '请至少选择一个岗位', trigger: 'change' }
    ],
    roles: [
      { required: true, message: '请至少选择一个角色', trigger: 'change' }
    ]
    // department: [
    //   { required: true, message: '请选择部门', trigger: 'change' }
    // ]
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

  const userForm = ref(null)
  // 验证表单并保存
  const handleSave = () => validateAndSave(userForm.value)
</script>
