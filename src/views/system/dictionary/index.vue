<template>
  <div>
    <el-container>
      <!-- 左侧字典列表 -->
      <el-aside class="p-2" width="50%">
        <el-card shadow="never">
          <div v-if="searchToggle" class="ape-volo-search">
            <el-form :inline="true" :model="searchInfo">
              <el-form-item label="名称">
                <el-input v-model="searchInfo.name" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  v-model="searchInfo.description"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item label="字典类型">
                <el-select
                  v-model="searchInfo.dictType"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in dictOptionType"
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
            <CrudOpts :perms="perms" />
            <el-table
              ref="tableRef"
              highlight-current-row
              :data="data"
              v-loading="loading"
              @selection-change="onSelectionChange"
              @sort-change="onSortChange"
              style="width: 100%"
              row-key="id"
              @row-click="handleDictionaryRowClick"
            >
              <el-table-column align="left" type="selection" width="55" />
              <el-table-column
                align="left"
                prop="dictType"
                min-width="40"
                :formatter="
                  (row, column, cellValue) =>
                    showDictLabel(dictTypeOption, cellValue)
                "
                label="字典类型"
                sortable="custom"
              />
              <el-table-column
                align="left"
                prop="name"
                label="名称"
                sortable="custom"
              />
              <el-table-column
                align="left"
                prop="description"
                label="描述"
                sortable="custom"
              />
              <el-table-column align="left" min-width="50" label="操作">
                <template #default="scope">
                  <RowOpts
                    :row="scope.row"
                    :val="scope.row.name"
                    :perms="perms"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-bind="pagination" />
          </div>
        </el-card>
      </el-aside>

      <!-- 右侧字典详情 -->
      <el-main class="p-2">
        <el-card shadow="never">
          <detailPanel
            :selected-dictionary-id="selectedDictionaryId"
            :selected-dictionary-name="selectedDictionaryName"
          />
        </el-card>
      </el-main>
    </el-container>

    <!--表单渲染-->
    <dictionaryFormPanel :dict-type-option="dictTypeOption" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { get, del, add, edit, download } from '@/api/system/dictionary'
  import detailPanel from './detail.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import dictionaryFormPanel from './module/dictionaryFormPanel.vue'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'

  defineOptions({
    name: 'Dictionary'
  })

  const perms = {
    add: ['sys:dict:add'],
    edit: ['sys:dict:edit'],
    del: ['sys:dict:del'],
    download: ['sys:dict:download']
  }

  const selectedDictionaryId = ref(0)
  const selectedDictionaryName = ref('')

  const searchInfo = ref({})

  const dictTypeOption = ref([])
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
      dictType: 2,
      name: null,
      description: null
    }),
    searchInfo
  })
  getDict('dict_type')
    .then((res) => {
      dictTypeOption.value = res
    })
    .catch((err) => {
      console.error('获取 dict_type 失败:', err)
    })

  // 点击字典行事件
  const handleDictionaryRowClick = async (row) => {
    selectedDictionaryId.value = row.id
    selectedDictionaryName.value = row.name
  }
</script>
<style>
  html.dark .el-card {
    --el-card-bg-color: transparent !important;
  }
</style>
