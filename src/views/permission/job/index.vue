<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="设置名称">
          <el-input
            v-model="searchInfo.name"
            clearable
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="设置状态">
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
        :data="data"
        v-loading="loading"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column align="left" type="selection" width="55" />
        <el-table-column
          align="left"
          prop="name"
          label="名称"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="sort"
          label="排序"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="status"
          label="状态"
          sortable="custom"
        >
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
        <el-table-column
          align="left"
          prop="createTime"
          label="创建时间"
          sortable="custom"
        />
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <!--表单渲染-->
    <formPanel :status-type-option="statusTypeOption" />
  </div>
</template>

<script setup>
  import { del, edit, get, add, download } from '@/api/permission/job'
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
    name: 'Job'
  })

  const perms = {
    add: ['sys:job:add'],
    edit: ['sys:job:edit'],
    del: ['sys:job:del'],
    download: ['sys:job:download']
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
      name: '',
      sort: 999,
      enabled: true
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
