<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="租户名称">
          <el-input v-model="searchInfo.name" placeholder="请输入" />
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
    <div v-else class="p-1 rounded"></div>
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
        <el-table-column prop="name" label="租户编号" sortable="custom" />
        <el-table-column prop="name" label="租户名称" sortable="custom" />
        <el-table-column
          prop="tenantType"
          :formatter="tenantTypeFormatter"
          label="租户类型"
          sortable="custom"
        />
        <el-table-column
          prop="dbType"
          :formatter="dbTypeFormatter"
          label="库类型"
          sortable="custom"
        />
        <el-table-column prop="configId" label="数据库标识" />
        <el-table-column prop="connectionString" label="数据库链接" />
        <el-table-column prop="description" label="描述" />
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
      :tenant-type-option="tenantTypeOption"
      :db-type-option="dbTypeOption"
    />
  </div>
</template>

<script setup lang="ts">
  import { del, edit, get, add, download } from '@/api/system/tenant'
  import type { TenantQueryParams } from '@/api/system/types/tenant.types'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/Crud/DateRangePicker.vue'
  import { getDict, showDictLabel, type DictOption } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/Crud/CrudOpts.vue'
  import RowOpts from '@/components/Crud/RowOpts.vue'
  import SearchOpts from '@/components/Crud/SearchOpts.vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'Tenant'
  })

  const perms = {
    add: ['sys:tenant:add'],
    edit: ['sys:tenant:edit'],
    del: ['sys:tenant:del'],
    download: ['sys:tenant:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref<TenantQueryParams>({})

  // 状态
  const statusTypeOption = ref<DictOption[]>([])
  // 租户类型
  const tenantTypeOption = ref<DictOption[]>([])
  // 数据库类型
  const dbTypeOption = ref<DictOption[]>([])

  // 租户类型 formatter
  const tenantTypeFormatter = (_row: any, _column: any, cellValue: any) => {
    return showDictLabel(tenantTypeOption.value, cellValue)
  }

  // 数据库类型 formatter
  const dbTypeFormatter = (_row: any, _column: any, cellValue: any) => {
    return showDictLabel(dbTypeOption.value, cellValue)
  }

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
      tenantId: undefined,
      name: '',
      description: undefined,
      tenantType: undefined,
      dbType: undefined,
      configId: undefined,
      connectionString: undefined
    }),
    searchInfo
  })

  const init = async () => {
    statusTypeOption.value = await getDict('status_type')
    tenantTypeOption.value = await getDict('tenant_type')
    dbTypeOption.value = await getDict('db_type')
  }

  init()
</script>
