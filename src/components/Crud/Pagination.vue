<template>
  <div>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />
  </div>
</template>

<script setup>
  defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    pageSizes: {
      type: Array,
      default: () => [10, 30, 50, 100]
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  })

  const emit = defineEmits([
    'update:currentPage',
    'update:pageSize',
    'current-change',
    'size-change',
    'prev-click',
    'next-click'
  ])

  const handleCurrentChange = (page) => {
    emit('update:currentPage', page)
    emit('current-change', page)
  }

  const handleSizeChange = (size) => {
    emit('update:pageSize', size)
    emit('size-change', size)
  }

  const handlePrevClick = (page) => {
    emit('prev-click', page)
  }

  const handleNextClick = (page) => {
    emit('next-click', page)
  }
</script>
