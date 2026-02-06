<!--搜索与重置-->
<template>
  <el-form-item>
    <el-button type="primary" icon="search" @click="refresh">搜索</el-button>
    <el-button icon="refresh" @click="resetQuery">重置</el-button>
  </el-form-item>
</template>
<script setup>
  import { inject } from 'vue'
  // 注入crud
  const crud = inject('crud')
  const { refresh, resetQuery } = crud
</script>
