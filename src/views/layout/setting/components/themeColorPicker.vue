<template>
  <div class="ape-theme-font" :style="{ '--theme-primary': modelValue }">
    <div class="ape-theme-card-bg p-4">
      <div class="mb-4">
        <p
          class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4"
        >
          推荐配色
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          选择一组预设主色，快速切换界面视觉风格。
        </p>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="colorItem in presetColors"
            :key="colorItem.value"
            class="theme-color-option flex items-center gap-4 p-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-150 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-lg"
            :class="{
              'is-selected transform -translate-y-1 shadow-lg':
                modelValue === colorItem.value
            }"
            @click="handleColorChange(colorItem.value)"
          >
            <div
              class="theme-color-swatch relative w-10 h-10 border border-gray-300 dark:border-gray-500 flex-shrink-0 shadow-sm"
              :style="{ backgroundColor: colorItem.value }"
            >
              <div
                v-if="modelValue === colorItem.value"
                class="absolute inset-0 flex items-center justify-center text-white text-base"
                style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3)"
              >
                <el-icon>
                  <Check />
                </el-icon>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <span class="block text-sm font-semibold ape-theme-text-main">{{
                colorItem.label
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="custom-theme-color-row p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-6 shadow-sm"
      >
        <div class="custom-theme-color-info min-w-0">
          <h4
            class="custom-theme-color-title text-base font-semibold ape-theme-text-main"
          >
            自定义主色
          </h4>
          <div class="custom-theme-color-meta">
            <div
              class="theme-color-chip w-5 h-5 border border-gray-300 dark:border-gray-500 shadow-sm flex-shrink-0"
              :style="{ backgroundColor: modelValue }"
            ></div>
            <code
              class="custom-theme-color-code text-sm font-mono bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 border border-gray-200 dark:border-gray-500"
            >
              {{ modelValue }}
            </code>
          </div>
        </div>
        <el-color-picker
          v-model="customColor"
          size="large"
          :predefine="presetColors.map((item) => item.value)"
          class="custom-color-picker"
          @change="handleCustomColorChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Check } from '@element-plus/icons-vue'

  defineOptions({
    name: 'ThemeColorPicker'
  })

  const props = withDefaults(
    defineProps<{
      modelValue?: string
    }>(),
    {
      modelValue: '#3b82f6'
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [color: string]
  }>()

  const customColor = ref<string>(props.modelValue)

  interface ColorItem {
    value: string
    label: string
  }

  const presetColors: ColorItem[] = [
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
    { value: '#FFD700', label: '金色' }
  ]

  const handleColorChange = (color: string): void => {
    customColor.value = color
    emit('update:modelValue', color)
  }

  const handleCustomColorChange = (color: string | null): void => {
    if (color) {
      emit('update:modelValue', color)
    }
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      customColor.value = newValue
    }
  )
</script>

<style scoped>
  .custom-theme-color-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-radius: calc(var(--ape-volo-radius));
  }

  .custom-theme-color-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  .custom-theme-color-title {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .custom-theme-color-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .custom-theme-color-code {
    white-space: nowrap;
    border-radius: calc(var(--ape-volo-radius));
  }

  .theme-color-option {
    position: relative;
    transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
    border-radius: calc(var(--ape-volo-radius));
  }

  .theme-color-swatch {
    border-radius: calc(var(--ape-volo-radius));
  }

  .theme-color-chip {
    border-radius: calc(var(--ape-volo-radius));
  }

  .theme-color-option:not(.is-selected):hover {
    border-color: var(--theme-primary) !important;
    box-shadow:
      inset 0 0 0 1px var(--theme-primary),
      0 10px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  .theme-color-option.is-selected {
    border-color: var(--theme-primary) !important;
    box-shadow:
      inset 0 0 0 1px var(--theme-primary),
      0 10px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  .dark .theme-color-option.is-selected {
    box-shadow:
      inset 0 0 0 1px var(--theme-primary),
      0 10px 24px rgba(0, 0, 0, 0.28);
  }

  .dark .theme-color-option:not(.is-selected):hover {
    box-shadow:
      inset 0 0 0 1px var(--theme-primary),
      0 10px 24px rgba(0, 0, 0, 0.22);
  }

  .custom-color-picker {
    ::v-deep(.el-color-picker__trigger) {
      border: 1px solid #e5e7eb;
      border-radius: calc(var(--ape-volo-radius));
      transition: all 150ms ease-in-out;

      &:hover {
        border-color: var(--theme-primary);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .dark .custom-color-picker {
    ::v-deep(.el-color-picker__trigger) {
      border-color: #4b5563;

      &:hover {
        border-color: var(--theme-primary);
      }
    }
  }

  @media (max-width: 640px) {
    .custom-theme-color-row {
      align-items: flex-start;
      flex-direction: column;
    }

    .custom-theme-color-info {
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
      gap: 0.625rem;
    }

    .custom-theme-color-meta {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
</style>
