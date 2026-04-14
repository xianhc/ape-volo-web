<template>
  <div class="flex justify-center">
    <div class="ape-theme-mode-selector theme-mode-selector-wrap">
      <div
        v-for="mode in themeModes"
        :key="mode.value"
        class="ape-theme-mode-item theme-mode-option"
        :class="[
          modelValue === mode.value
            ? 'is-active text-white shadow-sm transform -translate-y-0.5'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        ]"
        :style="getModeStyle(mode.value)"
        @click="handleModeChange(mode.value)"
      >
        <el-icon class="theme-mode-option__icon text-lg mb-1">
          <component :is="mode.icon" />
        </el-icon>
        <span class="theme-mode-option__label text-xs font-medium">{{
          mode.label
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { Component } from 'vue'
  import { storeToRefs } from 'pinia'
  import { Sunny, Moon, Monitor } from '@element-plus/icons-vue'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'ThemeModeSelector'
  })

  const props = withDefaults(
    defineProps<{
      modelValue?: string
    }>(),
    {
      modelValue: 'auto'
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [mode: string]
  }>()

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  const primaryColor = computed(() => config.value.primaryColor)

  interface ThemeMode {
    value: string
    label: string
    icon: Component
  }

  const themeModes: ThemeMode[] = [
    {
      value: 'light',
      label: '浅色',
      icon: Sunny
    },
    {
      value: 'dark',
      label: '深色',
      icon: Moon
    },
    {
      value: 'auto',
      label: '跟随系统',
      icon: Monitor
    }
  ]

  const handleModeChange = (mode: string): void => {
    emit('update:modelValue', mode)
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

  const getModeStyle = (mode: string) => {
    const isActive = props.modelValue === mode

    return {
      '--ape-mode-hover-bg': hexToRgba(primaryColor.value, 0.12),
      '--ape-mode-hover-border': hexToRgba(primaryColor.value, 0.34),
      '--ape-mode-active-shadow': hexToRgba(primaryColor.value, 0.82),
      ...(isActive
        ? {
            backgroundColor: primaryColor.value,
            borderColor: primaryColor.value,
            boxShadow: `0 12px 24px -18px ${hexToRgba(
              primaryColor.value,
              0.85
            )}`
          }
        : {})
    }
  }
</script>

<style scoped>
  .theme-mode-selector-wrap {
    padding: 0.375rem;
    border-radius: calc(var(--ape-volo-radius));
  }

  .theme-mode-option {
    position: relative;
    min-width: 94px;
    padding: 0.75rem 0.875rem;
    border: 1px solid transparent;
    border-radius: calc(var(--ape-volo-radius));
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background-color 0.18s ease,
      box-shadow 0.18s ease,
      color 0.18s ease;
  }

  .theme-mode-option__icon {
    transition: transform 0.18s ease;
  }

  .theme-mode-option__label {
    letter-spacing: 0.01em;
  }

  .theme-mode-option:not(.is-active):hover {
    background: var(--ape-mode-hover-bg) !important;
    border-color: var(--ape-mode-hover-border);
    box-shadow:
      inset 0 0 0 1px var(--ape-mode-hover-border),
      0 10px 22px -18px rgba(15, 23, 42, 0.16);
    transform: translateY(-2px);
  }

  .theme-mode-option:not(.is-active):hover .theme-mode-option__icon {
    transform: scale(1.08);
  }

  .theme-mode-option.is-active {
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, white 22%, transparent),
      0 14px 28px -18px var(--ape-mode-active-shadow);
  }

  :global(.dark) .theme-mode-option:not(.is-active):hover {
    box-shadow:
      inset 0 0 0 1px var(--ape-mode-hover-border),
      0 12px 24px -18px rgba(0, 0, 0, 0.28);
  }
</style>
