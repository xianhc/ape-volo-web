<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="部门">
          <el-cascader
            v-model="searchInfo.departmentIdArray"
            style="width: 250px"
            :options="departmentOption"
            :props="{
              checkStrictly: true,
              multiple: true,
              //collapse : false,
              label: 'name',
              value: 'id',
              emitPath: false
            }"
            :show-all-levels="false"
            filterable
            clearable
            collapse-tags
            collapse-tags-tooltip
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchInfo.userName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="searchInfo.nickName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchInfo.enabled"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="租户">
          <el-select
            v-model="searchInfo.tenantId"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in allTenantData"
              :key="item.tenantId"
              :label="item.name"
              :value="item.tenantId"
            />
          </el-select>
        </el-form-item>
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div v-else class="p-1 rounded"></div>
    <div class="ape-volo-table">
      <CrudOpts :perms="perms" />
      <el-table
        ref="tableRef"
        :data="data"
        v-loading="loading"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column
          align="left"
          type="selection"
          :selectable="checkboxT"
          width="55"
        />
        <el-table-column
          align="left"
          min-width="40"
          prop="userName"
          sortable="custom"
          label="用户名"
        />
        <el-table-column
          align="left"
          min-width="60"
          prop="nickName"
          sortable="custom"
          label="用户昵称"
        />
        <el-table-column
          align="left"
          min-width="60"
          prop="email"
          sortable="custom"
          label="邮箱"
        />
        <el-table-column
          align="left"
          min-width="50"
          prop="phone"
          sortable="custom"
          label="电话"
        />
        <el-table-column
          align="left"
          min-width="20"
          prop="genderCode"
          :formatter="
            (row, column, cellValue) => showDictLabel(genderOption, cellValue)
          "
          label="性别"
        />

        <el-table-column align="left" min-width="50" prop="method" label="部门">
          <template #default="scope">
            {{ scope.row.dept.name }}
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="60" prop="roles" label="角色">
          <template #default="scope">
            <el-select
              v-model="scope.row.roles"
              @visible-change="
                (flag) => {
                  visibleChangeRole(scope.row, flag)
                }
              "
              @remove-tag="(removed) => deleteRole(scope.row, removed)"
              value-key="id"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
            >
              <el-option
                v-for="item in allRoleData"
                :key="item.id"
                :disabled="
                  roleLevel.value !== 1 && item.level <= roleLevel.value
                "
                :label="item.name"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="60" prop="jobs" label="岗位">
          <template #default="scope">
            <el-select
              v-model="scope.row.jobs"
              @visible-change="
                (flag) => {
                  visibleChangeJob(scope.row, flag)
                }
              "
              @remove-tag="(removed) => deleteJob(scope.row, removed)"
              value-key="id"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
            >
              <el-option
                v-for="item in allJobData"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          min-width="30"
          prop="enabled"
          label="状态"
        >
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.enabled"
              inline-prompt
              :loading="loadingMap[scope.row.id]"
              :active-text="showDictLabel(statusOption, 'true')"
              :inactive-text="showDictLabel(statusOption, 'false')"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="50" prop="method" label="租户">
          <template #default="scope">
            <div v-if="scope.row.tenant">{{ scope.row.tenant.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="createTime"
          sortable="custom"
          label="创建时间"
        />
        <el-table-column align="left" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <!--表单渲染-->
    <formPanel
      :genderOption="genderOption"
      :status-type-option="statusTypeOption"
      :department-option="departmentOption"
      :job-option="allJobData"
      :role-option="allRoleData"
      :tenant-option="allTenantData"
    />
  </div>
</template>

<script setup>
  import { nextTick, ref, reactive } from 'vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import formPanel from './module/formPanel.vue'
  import {
    add,
    edit,
    del,
    editUserJob,
    editUserRole,
    get,
    download
  } from '@/api/permission/user'
  import { getAll as getAllRole, getLevel } from '@/api/permission/role'
  import { getAll as getAllJob } from '@/api/permission/job'
  import { getAll as getAllTenant } from '@/api/system/tenant'
  import { getDeptTree } from '@/api/permission/department'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import { useUserStore } from '@/pinia/modules/user'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'

  defineOptions({
    name: 'User'
  })

  const perms = {
    add: ['sys:user:add'],
    edit: ['sys:user:edit'],
    del: ['sys:user:del'],
    download: ['sys:user:download']
  }

  //字典
  const statusTypeOption = ref([])
  const genderOption = ref([])
  const departmentOption = ref([])

  //角色
  const allRoleData = ref([])
  const roleLevel = ref(0)
  //岗位
  const allJobData = ref([])
  //岗位
  const allTenantData = ref([])

  const searchInfo = ref({})
  const {
    data,
    loading,
    onSelectionChange,
    pagination,
    searchToggle,
    onSortChange
  } = useCrud({
    crudMethod: {
      list: get,
      del: del,
      add: add,
      edit: edit,
      download: download
    },
    defaultForm: () => ({
      id: 0,
      userName: null,
      nickName: null,
      genderCode: 1,
      email: null,
      enabled: true,
      roles: [],
      jobs: [],
      dept: { id: null },
      phone: '',
      tenantId: null
    }),
    searchInfo
  })

  const init = async () => {
    statusTypeOption.value = await getDict('status_type')
    genderOption.value = await getDict('gender_code')
    const resDeptTree = await getDeptTree()
    departmentOption.value = resDeptTree.data
    const resRole = await getAllRole()
    allRoleData.value = resRole.data
    const resLevel = await getLevel()
    roleLevel.value = resLevel.data.level
    const resJob = await getAllJob()
    allJobData.value = resJob.data
    const resTenant = await getAllTenant()
    allTenantData.value = resTenant.data
  }

  init()

  const oldRolesMap = {} //原始数据 操作失败后恢复
  const visibleChangeRole = async (row, flag) => {
    if (flag) {
      oldRolesMap[row.id] = row.roles.map((r) => ({ ...r }))
    } else {
      await nextTick()
      const oldIds = (oldRolesMap[row.id] || [])
        .map((r) => r.id)
        .sort()
        .join(',')
      const newIds = (row.roles || [])
        .map((r) => r.id)
        .sort()
        .join(',')
      if (oldIds !== newIds) {
        await editUserRole({
          id: row.id,
          roleIdArray: row.roles.map((item) => item.id)
        })
          .then(() => {
            delete oldRolesMap[row.id]
            ElMessage({ type: 'success', message: '角色修改成功' })
          })
          .catch(() => {
            row.roles = oldRolesMap[row.id]
            delete oldRolesMap[row.id]
          })
      }
    }
  }

  const deleteRole = async (row, removed) => {
    oldRolesMap[row.id] = [...row.roles, removed].map((r) => ({ ...r }))
    editUserRole({
      id: row.id,
      roleIdArray: row.roles.map((item) => item.id)
    })
      .then(() => {
        delete oldRolesMap[row.id]
        ElMessage({ type: 'success', message: '角色删除成功' })
      })
      .catch(() => {
        row.roles = oldRolesMap[row.id]
        delete oldRolesMap[row.id]
      })
  }

  const oldJobsMap = {} //原始数据 操作失败后恢复
  const visibleChangeJob = async (row, flag) => {
    if (flag) {
      oldJobsMap[row.id] = row.jobs.map((j) => ({ ...j }))
    } else {
      await nextTick()
      const oldIds = (oldJobsMap[row.id] || [])
        .map((j) => j.id)
        .sort()
        .join(',')
      const newIds = (row.jobs || [])
        .map((j) => j.id)
        .sort()
        .join(',')
      if (oldIds !== newIds) {
        await editUserJob({
          id: row.id,
          jobIdArray: row.jobs.map((item) => item.id)
        })
          .then(() => {
            delete oldJobsMap[row.id]
            ElMessage({ type: 'success', message: '岗位修改成功' })
          })
          .catch(() => {
            row.jobs = oldJobsMap[row.id]
            delete oldJobsMap[row.id]
          })
      }
    }
  }

  const deleteJob = async (row, removed) => {
    oldJobsMap[row.id] = [...row.jobs, removed].map((j) => ({ ...j }))
    editUserJob({
      id: row.id,
      jobIdArray: row.jobs.map((item) => item.id)
    })
      .then(() => {
        delete oldJobsMap[row.id]
        ElMessage({ type: 'success', message: '岗位删除成功' })
      })
      .catch(() => {
        row.jobs = oldJobsMap[row.id]
        delete oldJobsMap[row.id]
      })
  }

  const loadingMap = reactive({})
  const changeEnabled = async (row, val) => {
    loadingMap[row.id] = true
    ElMessageBox.confirm(
      `你要将${row.userName}的状态切换为【${val ? '启用' : '禁用'}】吗？`,
      '切换状态',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        await edit(row).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        })
        loadingMap[row.id] = false
      })
      .catch(() => {
        row.enabled = !row.enabled
        loadingMap[row.id] = false
      })
  }

  const userStore = useUserStore()
  const checkboxT = (row) => {
    return row.id !== userStore.userInfo.id
  }
</script>
