<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="应用Id">
          <el-input
            oninput="value=value.replace(/[^0-9]/g,'')"
            v-model="searchInfo.appId"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model="searchInfo.appName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="searchInfo.remark" placeholder="请输入" />
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
        <el-table-column prop="appId" label="应用Id" sortable="custom" />
        <el-table-column prop="appName" label="应用名称" sortable="custom" />
        <el-table-column
          prop="appSecretKey"
          label="应用密钥"
          sortable="custom"
        />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column prop="createBy" label="创建人" sortable="custom" />
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
  import { del, edit, get, add, download } from '@/api/system/appSecret'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'AppSecret'
  })

  const perms = {
    add: ['sys:appSecret:add'],
    edit: ['sys:appSecret:edit'],
    del: ['sys:appSecret:del'],
    download: ['sys:appSecret:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref({})

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
      download: download
    },
    defaultForm: () => ({
      id: 0,
      appId: '',
      appSecretKey: '',
      appName: '',
      remark: ''
    }),
    searchInfo
  })
</script>
