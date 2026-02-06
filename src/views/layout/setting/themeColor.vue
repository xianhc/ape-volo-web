<template>
  <div
    class="p-4 flex items-center justify-center gap-6 border ape-volo-bg rounded-[var(--ape-volo-radius)] shadow"
  >
    <div class="grid grid-cols-4 gap-10 justify-items-center">
      <button
        v-for="color in colorOptions"
        :key="color.value"
        @click="handleClick(color.value)"
        :class="[
          // 始终有蓝色边框和 border
          'flex flex-col items-center w-20 h-20 justify-center rounded-[var(--ape-volo-radius)] select-none cursor-pointer text-lg border transition-all duration-300',
          // 条件覆盖选中&高亮
          colorValue === color.value
            ? '[border-color:var(--el-color-primary)] [box-shadow:0_0_0_1px_var(--el-color-primary)]'
            : 'border hover:[border-color:var(--el-color-primary)] hover:[box-shadow:0_0_0_1px_var(--el-color-primary)]'
        ]"
      >
        <div
          class="w-8 h-8 rounded-[var(--ape-volo-radius)] flex items-center justify-center"
          :style="{ background: color.value }"
        ></div>
        <div class="mt-2 font-semibold text-sm" :style="{ color: color.value }">
          {{ color.label }}
        </div>
      </button>
      <el-color-picker
        class="flex flex-col items-center w-20 h-20 justify-center rounded-[var(--ape-volo-radius)] select-none cursor-pointer text-lg border transition-all duration-300"
        v-model="customColor"
        :clearable="true"
        @change="appStore.togglePrimaryColor"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useAppStore } from '@/pinia'

  const appStore = useAppStore()

  const props = defineProps({
    colorValue: String
  })
  console.log('colorValue', props.colorValue)

  const colorOptions = [
    { value: '#3b82f6', label: '默认' },
    { value: '#8F5FE8', label: '紫罗兰' },
    { value: '#FFB3DE', label: '樱花粉' },
    { value: '#EBEB2F', label: '柠檬黄' },
    { value: '#A8F5A2', label: '浅绿色' },
    { value: '#bfc1c2', label: '锌色灰' },
    { value: '#28a745', label: '深绿色' },
    { value: '#1e40af', label: '深蓝色' },
    { value: '#FFA500', label: '橙黄色' },
    { value: '#EB2F96', label: '玫瑰红' },
    { value: '#888888', label: '中性色' },
    { value: '#708090', label: '石板灰' },
    { value: '#FF6347', label: '番茄红' },
    { value: '#00CED1', label: '宝石蓝' },
    { value: '#FFD700', label: '金色' } // 新增颜色
  ]

  const customColor = ref('')

  function handleClick(color) {
    if (color !== props.colorValue) {
      appStore.togglePrimaryColor(color)
    }
  }
</script>
