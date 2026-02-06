<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="部门名称">
          <el-input
            v-model="searchInfo.name"
            clearable
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="部门状态">
          <el-select
            v-model="searchInfo.enabled"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOption"
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
        row-key="id"
        lazy
        :load="GetChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
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
              :active-text="showDictLabel(statusOption, 'true')"
              :inactive-text="showDictLabel(statusOption, 'false')"
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
        <el-table-column align="left" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms">
              <template #left>
                <el-button
                  v-has-perm="perms.add"
                  type="primary"
                  link
                  icon="plus"
                  @click="toAdd({ parentId: scope.row.id })"
                >
                  新增下级
                </el-button>
              </template>
            </RowOpts>
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
  import { add, del, edit, get, download } from '@/api/permission/department'
  import { reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'

  defineOptions({
    name: 'Department'
  })

  const perms = {
    add: ['sys:dept:add'],
    edit: ['sys:dept:edit'],
    del: ['sys:dept:del'],
    download: ['sys:dept:download']
  }

  const searchInfo = ref({})
  // 状态
  const statusTypeOption = ref([])
  const {
    data,
    loading,
    toAdd,
    pagination,
    searchToggle,
    onSelectionChange,
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
      parentId: 0,
      sort: 999,
      enabled: true
    }),
    searchInfo
  })

  function GetChildren(tree, treeNode, resolve) {
    const params = { parentId: tree.id }
    setTimeout(() => {
      get(params).then((res) => {
        resolve(res.data.content)
      })
    }, 200)
  }

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
