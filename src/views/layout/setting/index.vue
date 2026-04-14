<template>
  <div @click="openSettingModal">
    <el-tooltip class="" effect="dark" content="系统设置" placement="bottom">
      <el-icon
        class="setting-trigger-icon w-8 h-8 shadow border border-gray-200 dark:border-gray-600 cursor-pointer border-solid"
      >
        <Setting />
      </el-icon>
    </el-tooltip>
    <el-drawer
      v-model="isModalVisible"
      title="系统配置"
      direction="rtl"
      :size="width"
      :show-close="false"
      class="ape-theme-drawer"
    >
      <template #header>
        <div
          class="flex items-center justify-between w-full px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        >
          <div>
            <h2
              class="text-xl font-semibold ape-theme-text-main ape-theme-font"
            >
              系统配置
            </h2>
            <p class="setting-drawer-subtitle">
              统一调整外观、布局和通用偏好，当前变更会自动保存。
            </p>
          </div>
        </div>
      </template>

      <div class="bg-white dark:bg-gray-900 px-6">
        <div class="px-8 pt-4 pb-6">
          <div class="flex justify-center">
            <div
              class="setting-tabs-wrap inline-flex bg-gray-100 dark:bg-gray-800 p-1.5 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div
                v-for="tab in tabs"
                :key="tab.key"
                class="setting-tab-trigger px-4 py-2 text-base text-center cursor-pointer font-medium transition-all duration-150 ease-in-out min-w-[80px]"
                :class="[
                  activeTab === tab.key
                    ? 'is-active text-white shadow-md transform -translate-y-0.5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
                :style="getTabStyle(tab.key)"
                @click="activeTab = tab.key"
              >
                <span class="setting-tab-label">{{ tab.label }}</span>
                <span class="setting-tab-desc">{{ tab.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pb-8 h-full overflow-y-auto">
          <div class="transition-all duration-300 ease-in-out">
            <AppearanceSettings v-if="activeTab === 'appearance'" />
            <LayoutSettings v-else-if="activeTab === 'layout'" />
            <GeneralSettings v-else-if="activeTab === 'general'" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onBeforeUnmount } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ElMessage } from 'element-plus'
  import { useAppStore } from '@/pinia'
  import { editPreferencesConfig } from '@/api/permission/user'
  import AppearanceSettings from './modules/appearance/index.vue'
  import LayoutSettings from './modules/layout/index.vue'
  import GeneralSettings from './modules/general/index.vue'

  defineOptions({
    name: 'SysSetting'
  })

  const appStore = useAppStore()
  const { config, device } = storeToRefs(appStore)

  const activeTab = ref('appearance')
  const isModalVisible = ref(false)
  let savePreferencesTimer: ReturnType<typeof setTimeout> | null = null

  const tabs = [
    { key: 'appearance', label: '外观', desc: '主题与主色' },
    { key: 'layout', label: '布局', desc: '导航与结构' },
    { key: 'general', label: '通用', desc: '维护与说明' }
  ]

  const width = computed(() => {
    return device.value === 'mobile' ? '100%' : '500px'
  })

  function openSettingModal() {
    isModalVisible.value = true
  }

  const hexToRgba = (hex: string | null | undefined, alpha: number): string => {
    if (!hex) {
      return `rgba(59, 130, 246, ${alpha})`
    }

    let normalizedHex = hex.replace('#', '')
    if (normalizedHex.length === 3) {
      normalizedHex = normalizedHex
        .split('')
        .map((char) => char + char)
        .join('')
    }

    if (normalizedHex.length !== 6) {
      return `rgba(59, 130, 246, ${alpha})`
    }

    const red = Number.parseInt(normalizedHex.slice(0, 2), 16)
    const green = Number.parseInt(normalizedHex.slice(2, 4), 16)
    const blue = Number.parseInt(normalizedHex.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  const getTabStyle = (tabKey: string) => {
    const isActive = activeTab.value === tabKey
    const primaryColor = config.value.primaryColor

    return {
      '--setting-tab-hover-bg': hexToRgba(primaryColor, 0.12),
      '--setting-tab-hover-border': hexToRgba(primaryColor, 0.34),
      ...(isActive
        ? {
            backgroundColor: primaryColor,
            borderColor: primaryColor,
            boxShadow: `0 12px 28px -18px ${hexToRgba(primaryColor, 0.78)}`
          }
        : {})
    }
  }

  const saveConfig = async () => {
    const preferencesConfig = JSON.stringify(config.value)
    await editPreferencesConfig(preferencesConfig)
    localStorage.setItem('sysPreferences', preferencesConfig)
    ElMessage.success('保存成功')
  }

  const queueSaveConfig = () => {
    if (savePreferencesTimer) {
      clearTimeout(savePreferencesTimer)
    }

    savePreferencesTimer = setTimeout(async () => {
      try {
        await saveConfig()
      } catch (error) {
        console.error('save preferences config error:', error)
        ElMessage.error('设置保存失败，请稍后重试')
      } finally {
        savePreferencesTimer = null
      }
    }, 500)
  }

  watch(
    config,
    () => {
      queueSaveConfig()
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    if (savePreferencesTimer) {
      clearTimeout(savePreferencesTimer)
    }
  })
</script>

<style lang="scss">
  .ape-theme-drawer {
    .el-drawer {
      @apply bg-white dark:bg-gray-900;
    }

    .el-drawer__header {
      @apply p-0 border-0;
    }

    .el-drawer__body {
      @apply p-0;
    }
  }

  .ape-theme-font {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
  }

  .ape-theme-card-bg {
    @apply bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 shadow-sm;
    border-radius: calc(var(--ape-volo-radius));
  }

  .ape-theme-card-white {
    @apply bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-5 hover:shadow-md transition-all duration-150 ease-in-out hover:-translate-y-0.5;
    border-radius: calc(var(--ape-volo-radius));
  }

  .ape-theme-section-header {
    @apply flex items-center justify-center mb-6;
  }

  .ape-theme-section-title {
    @apply px-6 text-lg font-semibold text-gray-700 dark:text-gray-300;
  }

  .ape-theme-divider {
    @apply h-px bg-gray-200 dark:bg-gray-700 flex-1;
  }

  .ape-theme-text-main {
    @apply text-gray-900 dark:text-white;
  }

  .ape-theme-text-sub {
    @apply text-gray-600 dark:text-gray-400;
  }

  .ape-theme-section-content {
    animation: fadeInUp 0.3s ease;
  }

  .ape-theme-setting-item {
    @apply flex items-center justify-between py-4 ape-theme-font border-b border-gray-100 dark:border-gray-700 last:border-b-0;
  }

  .ape-theme-setting-label {
    @apply text-sm font-medium ape-theme-text-main;
  }

  .ape-theme-mode-selector {
    @apply inline-flex bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 gap-1;
    border-radius: calc(var(--ape-volo-radius));
  }

  .ape-theme-mode-item {
    @apply flex flex-col items-center justify-center px-3 py-2 cursor-pointer transition-all duration-150 ease-in-out min-w-[64px];
    border-radius: calc(var(--ape-volo-radius));
  }

  .ape-theme-layout-card {
    @apply bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 p-3 cursor-pointer transition-all duration-150 ease-in-out hover:-translate-y-1 hover:shadow-xl;
    border-radius: calc(var(--ape-volo-radius));
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ape-theme-drawer ::-webkit-scrollbar {
    width: 6px;
  }

  .ape-theme-drawer ::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  .ape-theme-drawer ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }

  .dark .ape-theme-drawer ::-webkit-scrollbar-track {
    background: #1f2937;
  }

  .dark .ape-theme-drawer ::-webkit-scrollbar-thumb {
    background: #4b5563;

    &:hover {
      background: #6b7280;
    }
  }
</style>

<style lang="scss" scoped>
  .setting-drawer-subtitle {
    margin-top: 0.2rem;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: #6b7280;
  }

  .setting-tab-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: calc(var(--ape-volo-radius));
    position: relative;
    gap: 0.1rem;

    &:not(.is-active):hover {
      background: var(--setting-tab-hover-bg) !important;
      border-color: var(--setting-tab-hover-border);
      box-shadow: inset 0 0 0 1px var(--setting-tab-hover-border);
      transform: translateY(-1px);
    }
  }

  .setting-tab-trigger.is-active {
    box-shadow: 0 12px 28px -18px rgba(59, 130, 246, 0.65);
  }

  .setting-trigger-icon {
    border-radius: 9999px;
  }

  .setting-tabs-wrap {
    border-radius: calc(var(--ape-volo-radius));
  }

  .setting-tab-label {
    line-height: 1.2;
  }

  .setting-tab-desc {
    font-size: 0.675rem;
    line-height: 1.1;
    opacity: 0.72;
    font-weight: 500;
  }

  :global(.dark) .setting-drawer-subtitle {
    color: #9ca3af;
  }

  @media (max-width: 640px) {
    .setting-tab-trigger {
      min-width: 0;
      flex: 1;
      padding-inline: 0.75rem;
    }
  }

  .reset-btn {
    @apply font-medium transition-all duration-150 ease-in-out hover:-translate-y-0.5 hover:brightness-90 hover:shadow-lg;
    border-radius: calc(var(--ape-volo-radius));
  }
</style>
