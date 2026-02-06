<template>
  <div class="flex items-center mx-4 gap-4">
    <MenuSearch />

    <SysSetting />

    <Fullscreen />

    <el-tooltip class="" effect="dark" content="刷新" placement="bottom">
      <el-icon
        class="w-8 h-8 shadow rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer border-solid"
        :class="showRefreshAnmite ? 'animate-spin' : ''"
        @click="toggleRefresh"
      >
        <Refresh />
      </el-icon>
    </el-tooltip>
    <el-tooltip
      class=""
      effect="dark"
      :content="appStore.isDark ? '切换为浅色' : '切换为深色'"
      placement="bottom"
    >
      <el-icon
        v-if="appStore.isDark"
        class="w-8 h-8 shadow rounded-full border border-gray-600 cursor-pointer border-solid"
        @click="appStore.toggleTheme(false)"
      >
        <Sunny />
      </el-icon>
      <el-icon
        v-else
        class="w-8 h-8 shadow rounded-full border border-gray-200 cursor-pointer border-solid"
        @click="appStore.toggleTheme(true)"
      >
        <Moon />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup>
  import { useAppStore } from '@/pinia'
  import { ref } from 'vue'
  import { emitter } from '@/utils/bus.js'
  import SysSetting from '@/views/layout/setting/index.vue'
  import MenuSearch from '@/components/MenuSearch/index.vue'
  import Fullscreen from '@/components/Fullscreen/index.vue'

  const appStore = useAppStore()
  const showRefreshAnmite = ref(false)
  const toggleRefresh = () => {
    showRefreshAnmite.value = true
    emitter.emit('reload')
    setTimeout(() => {
      showRefreshAnmite.value = false
    }, 1000)
  }
</script>
