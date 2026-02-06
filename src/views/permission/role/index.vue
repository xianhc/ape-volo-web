<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchInfo.name"
            clearable
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-select
            v-model="searchInfo.dataScopeType"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in dataScopeTypeOption"
              :key="Number(item.value)"
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
        style="width: 100%"
        row-key="id"
      >
        <el-table-column align="left" type="selection" width="55" />
        <el-table-column
          align="left"
          prop="name"
          label="角色名称"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="authCode"
          label="角色代码"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="dataScopeType"
          :formatter="
            (row, column, cellValue) =>
              showDictLabel(dataScopeTypeOption, cellValue)
          "
          label="数据权限"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="level"
          label="角色级别"
          sortable="custom"
        />
        <el-table-column align="left" prop="description" label="描述" />
        <el-table-column
          align="left"
          prop="createTime"
          label="创建日期"
          sortable="custom"
        />
        <el-table-column align="left" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms">
              <template #left>
                <el-button
                  v-has-role="'admin'"
                  icon="setting"
                  type="primary"
                  link
                  @click="handleOpenAuthorizeDialog(scope.row.id)"
                  >设置权限
                </el-button>
              </template>
            </RowOpts>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <!--表单渲染-->
    <formPanel :data-scope-type-option="dataScopeTypeOption" />

    <!--权限配置-->
    <authorizePanel ref="authorizeRef" />
  </div>
</template>

<script setup>
  import { add, edit, del, get, download } from '@/api/permission/role'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import authorizePanel from './module/authorizePanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'

  defineOptions({
    name: 'Role'
  })

  const perms = {
    add: ['sys:role:add'],
    edit: ['sys:role:edit'],
    del: ['sys:role:del'],
    download: ['sys:role:download']
  }

  // 数据权限
  const dataScopeTypeOption = ref([])
  const searchInfo = ref({})
  const {
    data,
    loading,
    onSelectionChange,
    onSortChange,
    pagination,
    searchToggle
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
      name: null,
      authCode: null,
      deptIdArray: [],
      description: null,
      dataScopeType: null,
      level: 999
    }),
    searchInfo
  })

  getDict('data_scope_type')
    .then((res) => {
      dataScopeTypeOption.value = res
    })
    .catch((err) => {
      console.error('获取 data_scope_type 失败:', err)
    })

  const authorizeRef = ref(null)
  const handleOpenAuthorizeDialog = (id) => {
    authorizeRef.value.openAuthorizeDialog(id) // 调用子组件方法并传递行对象
  }
</script>
