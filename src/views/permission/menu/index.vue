<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="菜单标题">
          <el-input
            v-model="searchInfo.title"
            clearable
            style="width: 200px"
            placeholder="请输入"
          />
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
          prop="title"
          label="菜单标题"
          sortable="custom"
        >
          <template #default="scope">
            <span>{{ scope.row.title }}</span>
            <el-icon v-if="scope.row.icon" class="menu-title-icon">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="menuType"
          :formatter="
            (row, column, cellValue) => showDictLabel(menuTypeOption, cellValue)
          "
          label="类型"
          sortable="custom"
        />
        <el-table-column
          align="left"
          min-width="120"
          prop="path"
          label="路由地址"
          sortable="custom"
        />
        <el-table-column
          align="left"
          min-width="160"
          prop="component"
          label="页面组件"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="componentName"
          label="组件名称"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="authCode"
          label="权限标识"
          sortable="custom"
        />
        <el-table-column
          align="left"
          prop="keepAlive"
          label="状态"
          sortable="custom"
        >
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.enabled"
              inline-prompt
              :disabled="true"
              :active-text="showDictLabel(statusTypeOption, 'true')"
              :inactive-text="showDictLabel(statusTypeOption, 'false')"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="keepAlive"
          label="是否缓存"
          sortable="custom"
        >
          <template v-slot="scope">
            <el-switch v-model="scope.row.keepAlive" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="hidden"
          label="是否隐藏"
          sortable="custom"
        >
          <template v-slot="scope">
            <el-switch v-model="scope.row.hidden" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="sort"
          label="排序"
          sortable="custom"
        />
        <el-table-column
          align="left"
          :min-width="100"
          prop="createTime"
          label="创建时间"
          sortable="custom"
        />
        <el-table-column align="left" :min-width="160" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms">
              <template #left>
                <el-button
                  v-has-perm="perms.add"
                  type="primary"
                  link
                  icon="plus"
                  v-show="scope.row.menuType !== 3"
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
    <formPanel
      :status-type-option="statusTypeOption"
      :menu-type-option="menuTypeOption"
      :badge-type-option="badgeTypeOption"
    />
  </div>
</template>

<script setup>
  import { add, edit, del, get, download } from '@/api/permission/menu'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'

  defineOptions({
    name: 'Menus'
  })

  const perms = {
    add: ['sys:menu:add'],
    edit: ['sys:menu:edit'],
    del: ['sys:menu:del'],
    download: ['sys:menu:download']
  }

  const searchInfo = ref({})
  // 菜单类型
  const menuTypeOption = ref([])
  // 徽章类型
  const badgeTypeOption = ref([])
  // 状态
  const statusTypeOption = ref([])
  const {
    data,
    loading,
    searchToggle,
    onSelectionChange,
    onSortChange,
    toAdd,
    pagination
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
      title: null,
      sort: 999,
      path: null,
      component: null,
      componentName: null,
      parentId: 0,
      icon: '',
      keepAlive: false,
      hidden: false,
      menuType: 2,
      enabled: true,
      authCode: null,
      badgeType: null,
      badgeText: null,
      badgeStyle: null
    }),
    searchInfo
  })

  const init = async () => {
    menuTypeOption.value = await getDict('menu_type')
    badgeTypeOption.value = await getDict('badge_type')
    statusTypeOption.value = await getDict('status_type')
  }

  init()

  function GetChildren(tree, treeNode, resolve) {
    const params = { parentId: tree.id }
    setTimeout(() => {
      get(params).then((res) => {
        resolve(res.data.content)
      })
    }, 200)
  }
</script>

<style lang="scss">
  .menu-title-icon {
    margin-left: 8px;
    vertical-align: middle;
  }
</style>
