<template>
  <div>
    <!-- 未选择字典时的提示 -->
    <el-empty
      v-if="!props.selectedDictionaryId"
      description="请在左侧选择一个字典查看详情"
      :image-size="120"
    />

    <!-- 字典详情列表 -->
    <div v-else>
      <div class="ape-volo-search">
        <el-form :inline="true" :model="detailSearchInfo">
          <el-form-item label="标签名">
            <el-input v-model="detailSearchInfo.label" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="数据值">
            <el-input v-model="detailSearchInfo.value" placeholder="请输入" />
          </el-form-item>
          <SearchOpts />
        </el-form>
      </div>
      <div class="ape-volo-table">
        <div class="ape-volo-btn-list">
          <el-button
            v-has-perm="perms.add"
            type="primary"
            icon="plus"
            @click="toAdd"
            >新增字典详情</el-button
          >
          <el-button
            v-has-perm="perms.del"
            icon="delete"
            type="danger"
            :disabled="!multipleSelection.length"
            @click="doBatchDelete"
            >删除
          </el-button>
        </div>
        <el-table
          ref="tableRef"
          :data="data"
          @selection-change="onSelectionChange"
          @sort-change="onSortChange"
          v-loading="loading"
          row-key="id"
        >
          <el-table-column
            align="left"
            type="selection"
            width="55"
            sortable="custom"
          />
          <el-table-column
            align="left"
            prop="label"
            label="标签名"
            sortable="custom"
          />
          <el-table-column
            align="left"
            prop="value"
            label="数据值"
            sortable="custom"
          />
          <el-table-column
            align="left"
            prop="dictSort"
            label="排序"
            sortable="custom"
          />
          <el-table-column
            align="left"
            prop="createTime"
            label="创建时间"
            sortable="custom"
          />
          <el-table-column align="left" label="操作">
            <template #default="scope">
              <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-bind="pagination" />
      </div>
    </div>
    <!--表单渲染-->
    <dictionaryDetailFormPanel :dict-name="selectedDictionaryName" />
  </div>
</template>

<script setup>
  import { ref, watchEffect } from 'vue'
  import { get, del, add, edit } from '@/api/system/dictionaryDetail'
  import { useCrud } from '@/components/Crud/UseCrud'
  import dictionaryDetailFormPanel from './module/dictionaryDetailFormPanel.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'

  defineOptions({
    name: 'DictionaryDetail'
  })

  const perms = {
    add: ['sys:dict:add'],
    edit: ['sys:dict:edit'],
    del: ['sys:dict:del'],
    download: ['sys:dict:download']
  }

  const props = defineProps({
    selectedDictionaryId: {
      type: Number,
      default: 0
    },
    selectedDictionaryName: {
      type: String,
      default: ''
    }
  })
  const dictName = ref('')

  // 使用不同的变量名避免冲突
  const detailSearchInfo = ref({})
  const {
    data,
    loading,
    pagination,
    onSelectionChange,
    toAdd,
    doBatchDelete,
    multipleSelection,
    onSortChange
  } = useCrud({
    crudMethod: { list: get, del: del, add: add, edit: edit },
    defaultForm: () => ({
      id: 0,
      dictId: props.selectedDictionaryId,
      label: null,
      value: null,
      dictSort: 999
    }),
    searchInfo: detailSearchInfo,
    sortProp: 'dictSort',
    sortOrder: 'ascending',
    refreshOnInit: false
  })

  // 使用 watchEffect 确保响应式更新
  watchEffect(() => {
    if (props.selectedDictionaryId) {
      detailSearchInfo.value.dictId = props.selectedDictionaryId
    }
    if (props.selectedDictionaryName) {
      dictName.value = props.selectedDictionaryName
    }
  })
</script>
