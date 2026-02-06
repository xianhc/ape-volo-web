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
        <el-form-item label="用户名称">
          <el-input v-model="searchInfo.userName" placeholder="请输入" />
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
        <el-table-column prop="id" label="账号Id" sorttable="custom" />
        <el-table-column prop="email" label="邮箱" sortable="custom" />
        <el-table-column
          prop="displayName"
          label="显示名称"
          sortable="custom"
        />
        <el-table-column prop="host" label="主机" sortable="custom" />
        <el-table-column prop="port" label="端口" sortable="custom" />
        <el-table-column prop="userName" label="用户名称" sortable="custom" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="enableSsl" label="Ssl" sortable="custom">
          <template v-slot="scope">
            <el-switch v-model="scope.row.enableSsl" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          prop="useDefaultCredentials"
          label="系统凭据"
          sortable="custom"
        >
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.useDefaultCredentials"
              :disabled="true"
            />
          </template>
        </el-table-column>
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
    <formPanel />
  </div>
</template>

<script setup>
  import { del, edit, get, add } from '@/api/message/email/emailAccount'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'EmailAccount'
  })

  const perms = {
    add: ['sys:emailAccount:add'],
    edit: ['sys:emailAccount:edit'],
    del: ['sys:emailAccount:del'],
    download: ['sys:emailAccount:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref({
    email: null,
    displayName: null,
    userName: null
  })

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
      email: null,
      displayName: null,
      host: null,
      port: null,
      userName: null,
      password: null,
      enableSsl: false,
      useDefaultCredentials: false
    }),
    searchInfo
  })
</script>
