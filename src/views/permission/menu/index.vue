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
        v-loading="loading"
        :data="data"
        lazy
        row-key="id"
        :load="GetChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
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
          :formatter="formatMenuType"
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
          <template #default="scope">
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
          <template #default="scope">
            <el-switch v-model="scope.row.keepAlive" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="hidden"
          label="是否隐藏"
          sortable="custom"
        >
          <template #default="scope">
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
          <template #default="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms">
              <template #left>
                <el-button
                  v-show="scope.row.menuType !== 3"
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
    <formPanel
      :status-type-option="statusTypeOption"
      :menu-type-option="menuTypeOption"
      :badge-type-option="badgeTypeOption"
    />
  </div>
</template>

<script setup lang="ts">
  import { add, edit, del, get, download } from '@/api/permission/menu'
  import type { MenuQueryParams } from '@/api/permission/types/menu.types'
  import { ref } from 'vue'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/Crud/DateRangePicker.vue'
  import { getDict, showDictLabel, type DictOption } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/Crud/CrudOpts.vue'
  import RowOpts from '@/components/Crud/RowOpts.vue'
  import SearchOpts from '@/components/Crud/SearchOpts.vue'

  defineOptions({
    name: 'Menus'
  })

  const perms = {
    add: ['sys:menu:add'],
    edit: ['sys:menu:edit'],
    del: ['sys:menu:del'],
    download: ['sys:menu:download']
  }

  const searchInfo = ref<MenuQueryParams>({})
  // 菜单类型
  const menuTypeOption = ref<DictOption[]>([])
  // 徽章类型
  const badgeTypeOption = ref<DictOption[]>([])
  // 状态
  const statusTypeOption = ref<DictOption[]>([])

  // 格式化菜单类型
  const formatMenuType = (_row: any, _column: any, cellValue: any) => {
    return showDictLabel(menuTypeOption.value, cellValue)
  }

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
      title: undefined,
      sort: 999,
      path: undefined,
      component: undefined,
      componentName: undefined,
      parentId: 0,
      icon: '',
      keepAlive: false,
      hidden: false,
      menuType: 2,
      enabled: true,
      authCode: undefined,
      badgeType: undefined,
      badgeText: undefined,
      badgeStyle: undefined
    }),
    searchInfo
  })

  const init = async () => {
    menuTypeOption.value = await getDict('menu_type')
    badgeTypeOption.value = await getDict('badge_type')
    statusTypeOption.value = await getDict('status_type')
  }

  init()

  function GetChildren(tree: any, _treeNode: any, resolve: any) {
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
