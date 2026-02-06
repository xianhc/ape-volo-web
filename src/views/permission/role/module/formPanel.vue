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
          <el-button type="primary" :loading="loading" @click="handleSave">保存</el-button>
        </div>
      </div>
    </template>

    <el-form ref="roleForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色代码" prop="authCode">
        <el-input v-model="form.authCode" />
      </el-form-item>
      <el-form-item label="角色级别" prop="level">
        <el-input-number
          v-model.number="form.level"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 200px;"
        />
      </el-form-item>
      <el-form-item label="数据权限" prop="dataScopeType">
        <el-select
          v-model="form.dataScopeType"
          style="width: 200px"
          placeholder="请选择"
          @change="changeScope"
        >
          <el-option
            v-for="item in props.dataScopeTypeOption"
            :key="Number(item.value)"
            :label="item.label"
            :value="Number(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.dataScopeType === 5"
        label="数据权限"
      >
        <el-tree
          ref="deptTreeRef"
          :data="deptTreeData"
          :default-checked-keys="deptIdList"
          :props="{children: 'children', label: 'name', isLeaf: 'leaf' }"
          show-checkbox
          highlight-current
          node-key="id"
          default-expand-all
          check-strictly
        />
      </el-form-item>
      <el-form-item label="描述信息" prop="description">
        <el-input
          v-model="form.description"
          style="width: 100%"
          rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { useAppStore } from '@/pinia'
  import { inject, ref, watch } from 'vue'
  import { getDeptTree } from '@/api/permission/department'
  import { ElMessage } from 'element-plus'

  const appStore = useAppStore()


  const deptTreeData = ref([])
  const deptIdList = ref([])
  const deptTreeRef = ref(null)


  const props = defineProps({
    dataScopeTypeOption: {
      type: Array,
      required: true
    }
  })


  const initDepartmentTree = async () => {
    const res = await getDeptTree()
    deptTreeData.value = res.data
  }


  const changeScope = async () => {
    if (form.value.dataScopeType === 5) {
      await initDepartmentTree()
    }
  }

  // 注入crud
  const crud = inject('crud')
  const { form, dialogVisible, loading, closeDialog, validateAndSave, getFormTitle } = crud

  const roleForm = ref(null)
  const rules = ref({
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    authCode: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
    level: [{ required: true, message: '请选择角色级别', trigger: 'blur' }],
    dataScopeType: [{ required: true, message: '请选择角色数据权限', trigger: 'blur' }]
  })
  // 验证表单并保存
  const handleSave = () => {
    if (form.value.dataScopeType === 5) {
      const checkArr = deptTreeRef.value.getCheckedNodes(false, false)
      if (!checkArr?.length) {
        ElMessage.warning('请至少选择一个部门')
        return
      }
      form.value.deptIdArray = checkArr.map(item => item.id)
    }
    validateAndSave(roleForm.value)
  }

  // 监听是否自定义数据权限
  watch(
    () => dialogVisible.value,
    (val) => {
      if (val) {
        if (form.value.dataScopeType === 5) {
          initDepartmentTree()
          deptIdList.value = form.value.departmentList
            ? form.value.departmentList.map(item => item.id)
            : []
        }
      }
    }
  )

</script>
