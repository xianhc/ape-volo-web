<template>
  <div>
    <SidebarNav
      v-if="
        config.sideMode === MenuNavigationType.SidebarNav ||
        (device === 'mobile' && config.sideMode == MenuNavigationType.TopNav) ||
        (device === 'mobile' &&
          config.sideMode == MenuNavigationType.DualSidebarNav)
      "
    />
    <topNav
      v-if="
        config.sideMode === MenuNavigationType.TopNav && device !== 'mobile'
      "
    />
    <DualSidebarNav
      v-if="
        config.sideMode === MenuNavigationType.DualSidebarNav &&
        device !== 'mobile'
      "
    />
  </div>
</template>

<script setup>
  import SidebarNav from './sidebarNav.vue'
  import topNav from './topNav.vue'
  import DualSidebarNav from './dualSidebarNav.vue'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'

  defineProps({
    mode: {
      type: String,
      default: 'normal'
    }
  })

  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  const appStore = useAppStore()
  const { config, device } = storeToRefs(appStore)
</script>
