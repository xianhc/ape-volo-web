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
              :value="strToBool(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select
            v-model="searchInfo.priority"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in priorityTypeOption"
              :key="item.value"
              :label="item.label"
              :value="Number(item.value)"
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
        row-key="id"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="subject" label="邮件主题" sortable="custom" />
        <el-table-column prop="from" label="发件邮箱" sortable="custom" />
        <el-table-column prop="fromName" label="发件人名称" sortable="custom" />
        <el-table-column prop="to" label="收件邮箱" sortable="custom" />
        <el-table-column prop="toName" label="收件人名称" sortable="custom" />
        <el-table-column
          prop="bcc"
          :show-overflow-tooltip="true"
          min-width="200"
          label="抄送邮箱"
          sortable="custom"
        />
        <el-table-column prop="isSend" label="是否已发送" sortable="custom">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.isSend"
              :disabled="true"
              inline-prompt
            />
          </template>
        </el-table-column>
        <el-table-column prop="sentTries" label="发送次数" sortable="custom" />
        <el-table-column prop="sendTime" label="发送时间" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
          <template v-slot="scope">
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
      :priority-type-option="priorityTypeOption"
    />
  </div>
</template>

<script setup>
  import { getAll } from '@/api/message/email/emailAccount'
  import { del, edit, get, add } from '@/api/message/email/emailQueued'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'
  import { getDict } from '@/utils/dictionary'
  import { strToBool } from '@/utils/converter'

  defineOptions({
    name: 'EmailQueued'
  })

  const perms = {
    add: ['sys:queuedEmail:add'],
    edit: ['sys:queuedEmail:edit'],
    del: ['sys:queuedEmail:del'],
    download: ['sys:queuedEmail:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref({
    email: null,
    displayName: null,
    enabled: null
  })

  // 状态
  const statusTypeOption = ref([])
  // 优先级
  const priorityTypeOption = ref([])
  const emailAccountOption = ref([])

  const {
    data,
    searchToggle,
    loading,
    onSelectionChange,
    pagination,
    onSortChange
  } = useCrud({
    crudMethod: { list: get, del: del, add: add, edit: edit },
    defaultForm: () => ({
      id: 0,
      to: null,
      toName: null,
      priority: null,
      bcc: null,
      subject: null,
      body: '',
      sendTime: null,
      emailAccountId: null
    }),
    searchInfo
  })

  const init = async () => {
    statusTypeOption.value = await getDict('status_type')
    priorityTypeOption.value = await getDict('priority_type')

    const res = await getAll()
    emailAccountOption.value = res.data
  }

  init()
</script>
