<template>
  <div id="app" class="ape-volo-bg">
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { useAppStore } from '@/pinia'
  useAppStore()
  defineOptions({
    name: 'App'
  })
</script>
<style lang="scss">
  #app {
    overflow: hidden;
    font-weight: 400 !important;
  }
</style>
