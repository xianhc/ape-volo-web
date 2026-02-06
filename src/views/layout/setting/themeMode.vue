<template>
  <div
    class="p-4 flex items-center justify-center gap-6 border ape-volo-bg rounded-[var(--ape-volo-radius)] shadow"
  >
    <div class="grid grid-cols-3 gap-10 justify-items-center">
      <button
        v-for="item in options"
        :key="item.value"
        @click="handleClick(item.value)"
        :class="[
          'flex flex-col items-center w-32 h-24 justify-center rounded-[var(--ape-volo-radius)] select-none cursor-pointer text-lg border transition-all duration-300',
          modelValue === item.value
            ? '[border-color:var(--el-color-primary)] [box-shadow:0_0_0_1px_var(--el-color-primary)]'
            : ' hover:[border-color:var(--el-color-primary)] hover:[box-shadow:0_0_0_1px_var(--el-color-primary)]'
        ]"
      >
        <div class="text-4xl mb-2 transition-all duration-300">
          <el-icon>
            <component :is="item.icon" width="24" height="24" />
          </el-icon>
        </div>
        <div class="mt-2 font-semibold text-lg">{{ item.label }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useAppStore } from '@/pinia'

  const appStore = useAppStore()

  const props = defineProps({
    modelValue: String
  })

  const options = [
    { value: 'light', label: '浅色', icon: 'light' },
    { value: 'dark', label: '深色', icon: 'dark' },
    { value: 'auto', label: '跟随系统', icon: 'auto' }
  ]

  function handleClick(value) {
    if (value !== props.modelValue) {
      appStore.toggleDarkMode(value)
    }
  }
</script>
