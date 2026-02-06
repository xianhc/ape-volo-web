<template>
  <div class="" @click="toggle">
    <el-tooltip
      :content="isFullscreen ? '退出全屏' : '进入全屏'"
      placement="bottom"
    >
      <el-icon
        class="w-8 h-8 shadow rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer border-solid"
      >
        <component :is="isFullscreen ? 'fullscreen-exit' : 'FullScreen'" />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useFullscreen } from '@vueuse/core'

  const el = ref(null)
  const { isFullscreen, toggle } = useFullscreen(el)
</script>
