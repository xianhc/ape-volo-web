<template>
  <div>
    <sidebar-nav v-if="showSidebarNav" />
    <top-nav v-if="showTopNav" />
    <dual-sidebar-nav v-if="showDualSidebarNav" />
    <combination-nav v-if="showCombinationSidebarNav" mode="SidebarNav" />
  </div>
</template>

<script setup lang="ts">
  import SidebarNav from './sidebarNav.vue'
  import TopNav from './topNav.vue'
  import DualSidebarNav from './dualSidebarNav.vue'
  import CombinationNav from './combinationNav.vue'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'

  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  import { computed } from 'vue'
  const appStore = useAppStore()
  const { config, device } = storeToRefs(appStore)

  const isMobile = computed(() => device.value === 'mobile')

  const showSidebarNav = computed(() => {
    return (
      config.value.sideMode === MenuNavigationType.SidebarNav ||
      (isMobile.value && config.value.sideMode === MenuNavigationType.TopNav) ||
      (isMobile.value &&
        config.value.sideMode === MenuNavigationType.DualSidebarNav) ||
      (isMobile.value &&
        config.value.sideMode === MenuNavigationType.CombinationNav)
    )
  })

  const showTopNav = computed(() => {
    return (
      config.value.sideMode === MenuNavigationType.TopNav && !isMobile.value
    )
  })

  const showDualSidebarNav = computed(() => {
    return (
      config.value.sideMode === MenuNavigationType.DualSidebarNav &&
      !isMobile.value
    )
  })

  const showCombinationSidebarNav = computed(() => {
    return (
      config.value.sideMode === MenuNavigationType.CombinationNav &&
      !isMobile.value
    )
  })
</script>
