<template>
  <div>
    <slot name="left" />
    <el-button
      v-has-perm="props.perms.edit"
      :disabled="disabledEdit"
      icon="edit"
      type="primary"
      link
      @click="crud.toEdit(props.row)"
    >
      编辑
    </el-button>
    <el-popconfirm
      v-model="pop"
      placement="top"
      :title="getTitle()"
      width="200"
      confirm-button-text="确定"
      cancel-button-text="取消"
      @confirm="doDelete(props.row)"
      @cancel="doCancel"
    >
      <template #reference>
        <el-button
          v-has-perm="props.perms.del"
          :disabled="disabledDle"
          icon="delete"
          type="danger"
          link
          @click="toDelete"
        >
          删除
        </el-button>
      </template>
    </el-popconfirm>
    <slot name="right" />
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue'
  import type { PropType } from 'vue'
  import type { CrudInstance } from '@/components/Crud/UseCrud'

  interface RowData {
    id: number
    [key: string]: any
  }

  interface RowPerms {
    edit?: string | string[]
    del?: string | string[]
    [key: string]: any
  }

  const pop = ref(false)

  // 注入crud
  const crud = inject<CrudInstance<RowData>>('crud')
  if (!crud) {
    throw new Error('crud not provided')
  }
  const { doDelete } = crud

  const props = defineProps({
    perms: {
      type: Object as PropType<RowPerms>,
      default: () => ({})
    },
    row: {
      type: Object as PropType<RowData>,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    val: {
      type: String,
      default: ''
    }
  })

  const getTitle = () => {
    return props.val ? `确定删除${props.val}吗？` : '确定删除本条数据吗？'
  }

  function doCancel() {
    pop.value = false
  }

  function toDelete() {
    pop.value = true
  }
</script>
