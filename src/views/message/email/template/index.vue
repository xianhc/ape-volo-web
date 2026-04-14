<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="邮箱">
          <el-input v-model="searchInfo.email" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="searchInfo.displayName" placeholder="请输入" />
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
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div class="ape-volo-table">
      <CrudOpts :perms="perms" />
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="data"
        row-key="id"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="模板Id" sortable="custom" />
        <el-table-column prop="name" label="模板名称" sortable="custom" />
        <el-table-column prop="subject" label="邮件主题" sortable="custom" />
        <el-table-column
          prop="emailAccountId"
          label="发送邮箱"
          sortable="custom"
        >
          <template #default="scope">
            <el-select
              v-model="scope.row.emailAccountId"
              style="width: 200px"
              value-key="id"
            >
              <el-option
                v-for="item in emailAccountOption"
                :key="item.id"
                :label="item.displayName"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="bccEmailAddresses"
          :show-overflow-tooltip="true"
          min-width="200"
          label="抄送邮箱"
          sortable="custom"
        />
        <el-table-column prop="userName" label="状态" sortable="custom">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              inline-prompt
              :loading="loadingMap[scope.row.id]"
              :active-text="showDictLabel(statusTypeOption, 'true')"
              :inactive-text="showDictLabel(statusTypeOption, 'false')"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
          <template #default="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <!--表单渲染-->
    <formPanel
      :email-account-option="emailAccountOption"
      :status-type-option="statusTypeOption"
    />
  </div>
</template>

<script setup lang="ts">
  import { getAll, type EmailAccount } from '@/api/message/email/emailAccount'
  import { del, edit, get, add } from '@/api/message/email/emailTemplate'
  import { reactive, ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/Crud/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/Crud/CrudOpts.vue'
  import RowOpts from '@/components/Crud/RowOpts.vue'
  import SearchOpts from '@/components/Crud/SearchOpts.vue'
  import { useAppStore } from '@/pinia'
  import { getDict, showDictLabel, type DictOption } from '@/utils/dictionary'
  import { ElMessage, ElMessageBox } from 'element-plus'

  defineOptions({
    name: 'EmailTemplate'
  })

  const perms = {
    add: ['sys:emailTemplate:add'],
    edit: ['sys:emailTemplate:edit'],
    del: ['sys:emailTemplate:del'],
    download: ['sys:emailTemplate:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref({
    email: null,
    displayName: null,
    enabled: null
  })

  // 状态
  const statusTypeOption = ref<DictOption[]>([])
  const emailAccountOption = ref<EmailAccount[]>([])

  const {
    data,
    searchToggle,
    loading,
    onSelectionChange,
    pagination,
    onSortChange
  } = useCrud({
    crudMethod: {
      list: get,
      del: del,
      add: add,
      edit: edit,
      download: () => Promise.resolve()
    },
    defaultForm: () => ({
      id: 0,
      name: undefined,
      bccEmailAddresses: undefined,
      subject: undefined,
      body: '',
      enabled: true,
      emailAccountId: undefined
    }),
    searchInfo
  })

  const init = async () => {
    statusTypeOption.value = await getDict('status_type')

    const res = await getAll()
    emailAccountOption.value = res.data
  }

  init()

  const loadingMap = reactive<Record<string | number, boolean>>({})
  const changeEnabled = async (row: any, val: boolean) => {
    loadingMap[row.id] = true
    ElMessageBox.confirm(
      `你要将${row.name}的状态切换为【${val ? '启用' : '禁用'}】吗？`,
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
</script>
