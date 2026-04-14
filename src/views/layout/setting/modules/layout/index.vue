<template>
  <div class="ape-theme-font">
    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">布局模式</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <LayoutModeCard
          v-model="config.sideMode"
          @update:model-value="appStore.toggleSideMode"
        />
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">界面配置</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <PreferenceItem label="显示标签页">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >页面标签导航</span
              >
            </template>
            <el-switch
              v-model="config.showTabs"
              @change="appStore.toggleTabs"
            />
          </PreferenceItem>

          <PreferenceItem label="页面切换动画">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >页面过渡效果</span
              >
            </template>
            <el-select
              v-model="config.transitionType"
              class="w-32"
              size="small"
              @change="appStore.toggleTransition"
            >
              <el-option
                v-for="option in transitionOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </PreferenceItem>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">尺寸配置</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <div class="space-y-4">
            <div class="ape-theme-card-white">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium ape-theme-text-main">
                    侧边栏展开宽度
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    侧边栏完全展开时的宽度
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <el-input-number
                    v-model="config.layoutSideWidth"
                    :min="150"
                    :max="400"
                    :step="10"
                    size="small"
                    class="w-24"
                  />
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >px</span
                  >
                </div>
              </div>
            </div>

            <div class="ape-theme-card-white">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium ape-theme-text-main">
                    侧边栏收缩宽度
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    侧边栏收缩时的最小宽度
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <el-input-number
                    v-model="config.layoutSideCollapsedWidth"
                    :min="60"
                    :max="100"
                    size="small"
                    class="w-24"
                  />
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >px</span
                  >
                </div>
              </div>
            </div>

            <div class="ape-theme-card-white">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium ape-theme-text-main">
                    菜单项高度
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    侧边栏菜单项的行高
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <el-input-number
                    v-model="config.layoutSideItemHeight"
                    :min="30"
                    :max="50"
                    size="small"
                    class="w-24"
                  />
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-400"
                    >px</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  import { TransitionType } from '@/enums/TransitionType'
  import LayoutModeCard from '../../components/layoutModeCard.vue'
  import PreferenceItem from '../../components/preferenceItem.vue'

  defineOptions({
    name: 'LayoutSettings'
  })

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  interface SelectOption {
    value: string
    label: string
  }

  const transitionOptions = ref<SelectOption[]>([])

  const loadTransitionOptions = (): SelectOption[] => {
    const labelMap: Record<string, string> = {
      [TransitionType.Slide]: '滑动',
      [TransitionType.Fade]: '淡入淡出',
      [TransitionType.Zoom]: '缩放',
      [TransitionType.None]: '无动画'
    }

    return (Object.values(TransitionType) as string[]).map((value) => ({
      value,
      label: labelMap[value] ?? value
    }))
  }

  transitionOptions.value = loadTransitionOptions()
</script>
