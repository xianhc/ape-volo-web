<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="配置名称">
          <el-input v-model="searchInfo.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数据值">
          <el-input v-model="searchInfo.value" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="请输入" />
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
        :data="data"
        v-loading="loading"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="配置名称" sortable="custom" />
        <el-table-column prop="value" label="数据值" sortable="custom" />
        <el-table-column prop="status" label="状态" sortable="custom">
          <template v-slot="scope">
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
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
  </div>
  <!--表单渲染-->
  <formPanel :status-type-option="statusTypeOption" />
</template>

<script setup>
  import { del, edit, get, add, download } from '@/api/system/setting'
  import { reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'Setting'
  })

  const perms = {
    add: ['sys:setting:add'],
    edit: ['sys:setting:edit'],
    del: ['sys:setting:del'],
    download: ['sys:setting:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref({})

  // 状态
  const statusTypeOption = ref([])
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
      name: '',
      value: '',
      enabled: true,
      description: ''
    }),
    searchInfo
  })

  const loadingMap = reactive({})
  const changeEnabled = async (row, val) => {
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

  getDict('status_type')
    .then((res) => {
      statusTypeOption.value = res
    })
    .catch((err) => {
      console.error('获取 status_type 失败:', err)
    })
</script>
