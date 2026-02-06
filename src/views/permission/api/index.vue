<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="分组">
          <el-select v-model="searchInfo.group" clearable placeholder="请选择">
            <el-option
              v-for="item in apiGroupOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="searchInfo.method" clearable placeholder="请选择">
            <el-option
              v-for="item in httpMethodOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <SearchOpts />
      </el-form>
    </div>

    <div v-else class="p-1 rounded"></div>

    <div class="ape-volo-table">
      <CrudOpts :perms="perms">
        <template #right>
          <el-button
            v-has-role="['admin']"
            @click="doRefreshApis"
            type="primary"
          >
            <el-icon>
              <Refresh />
            </el-icon>
            刷新API
          </el-button>
        </template>
      </CrudOpts>
      <el-table
        ref="tableRef"
        :data="data"
        v-loading="loading"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column align="left" type="selection" width="55" />
        <el-table-column align="left" prop="group" label="组" />
        <el-table-column align="left" prop="url" label="请求地址" />
        <el-table-column align="left" prop="description" label="描述" />
        <el-table-column align="left" prop="method" label="请求方式" />
        <el-table-column align="left" prop="createTime" label="创建日期" />
        <el-table-column
          align="left"
          :min-width="appStore.operateMinWith"
          label="操作"
        >
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>

    <!--表单渲染-->
    <formPanel :http-method-option="dict" :api-group-option="apiGroupOption" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getDict } from '@/utils/dictionary'
  import {
    get,
    del,
    add,
    edit,
    download,
    group,
    refresh as refreshApi
  } from '@/api/permission/api'
  import formPanel from './module/formPanel.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'Api'
  })

  const perms = {
    add: ['sys:api:add'],
    edit: ['sys:api:edit'],
    del: ['sys:api:del'],
    download: ['sys:api:download']
  }

  const appStore = useAppStore()

  const httpMethodOption = ref([])
  const apiGroupOption = ref([])

  const searchInfo = ref({
    group: null,
    description: null,
    method: null
  })

  const {
    data,
    searchToggle,
    loading,
    onSelectionChange,
    pagination,
    onSortChange,
    refresh
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
      group: null,
      description: null,
      url: null,
      method: null
    }),
    searchInfo
  })

  // 刷新API
  const doRefreshApis = async () => {
    refreshApi()
      .then((res) => {
        ElMessage({
          type: 'success',
          message: res.message || '刷新成功'
        })
        refresh()
      })
      .catch(() => {})
  }

  // 获取API组
  const getApiGroups = async () => {
    group()
      .then((res) => {
        apiGroupOption.value = res.data
      })
      .catch(() => {})
  }

  getDict('http_method')
    .then((res) => {
      httpMethodOption.value = res
    })
    .catch((err) => {
      console.error('获取 http_method 失败:', err)
    })

  getApiGroups()
</script>
