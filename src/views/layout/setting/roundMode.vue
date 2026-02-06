<template>
  <div class="p-4 border ape-volo-bg rounded-[var(--ape-volo-radius)] shadow">
    <div class="grid grid-cols-5 gap-4 justify-items-center">
      <button
        v-for="item in roundOptions"
        :key="item.value"
        @click="handleClick(item.value)"
        :class="[
          'flex flex-col items-center w-20 h-10 justify-center rounded-[var(--ape-volo-radius)] select-none cursor-pointer text-lg',
          'ape-volo-bg text-gray-700 dark:text-gray-200 transition-all duration-300',
          'border',
          cornerSizeValue === item.value
            ? '[border-color:var(--el-color-primary)] [box-shadow:0_0_0_1px_var(--el-color-primary)]'
            : 'hover:[border-color:var(--el-color-primary)] hover:[box-shadow:0_0_0_1px_var(--el-color-primary)]'
        ]"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useAppStore } from '@/pinia'
  import { BorderRadiusType } from '@/enums/BorderRadiusType'

  const appStore = useAppStore()

  const props = defineProps({
    cornerSizeValue: Number
  })

  const roundOptions = Object.entries(BorderRadiusType).map(
    ([label, value]) => ({
      label,
      value
    })
  )

  function handleClick(size) {
    if (size !== props.cornerSizeValue) {
      appStore.toggleCornerSize(size)
    }
  }
</script>
