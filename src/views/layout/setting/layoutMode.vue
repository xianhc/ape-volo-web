<template>
  <div
    class="p-4 flex items-center justify-center gap-6 border ape-volo-bg rounded-[var(--ape-volo-radius)] shadow"
  >
    <div class="grid grid-cols-3 gap-10 justify-items-center">
      <button
        v-for="item in sideModeOptions"
        :key="item.value"
        @click="handleClick(item.value)"
        :class="[
          'flex flex-col items-center w-40 h-32 justify-center rounded-[var(--ape-volo-radius)] select-none border cursor-pointer text-lg',
          'ape-volo-bg text-gray-700 dark:text-gray-200 transition-all duration-300',
          sideModeValue === item.value
            ? '[border-color:var(--el-color-primary)] [box-shadow:0_0_0_1px_var(--el-color-primary)]'
            : 'hover:[border-color:var(--el-color-primary)] hover:[box-shadow:0_0_0_1px_var(--el-color-primary)]'
        ]"
      >
        <div class="text-4xl mb-2 transition-all duration-300">
          <el-icon :size="80">
            <component :is="item.icon" />
          </el-icon>
          <div class="font-semibold text-lg">{{ item.label }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useAppStore } from '@/pinia'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'

  const appStore = useAppStore()

  const props = defineProps({
    sideModeValue: String
  })

  const sideModeOptions = [
    {
      value: MenuNavigationType.SidebarNav,
      label: '侧边栏',
      icon: 'sidebar-nav'
    },
    { value: MenuNavigationType.TopNav, label: '顶部', icon: 'top-nav' },
    {
      value: MenuNavigationType.DualSidebarNav,
      label: '双侧边栏',
      icon: 'dual-sidebar-nav'
    }
  ]

  function handleClick(value) {
    if (value !== props.sideModeValue) {
      appStore.toggleSideMode(value)
    }
  }
</script>
