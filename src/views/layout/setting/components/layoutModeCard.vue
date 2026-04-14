<template>
  <div class="grid grid-cols-2 gap-6 nav-theme-font px-6" role="radiogroup">
    <div
      v-for="layout in layoutModes"
      :key="layout.value"
      class="nav-theme-layout-card ape-theme-layout-card"
      :class="{ 'is-selected': modelValue === layout.value }"
      role="radio"
      tabindex="0"
      :aria-checked="modelValue === layout.value"
      :aria-label="layout.label"
      :style="getCardStyle(layout.value)"
      @click="handleLayoutChange(layout.value)"
      @keydown.enter.prevent="handleLayoutChange(layout.value)"
      @keydown.space.prevent="handleLayoutChange(layout.value)"
    >
      <div
        v-if="modelValue === layout.value"
        class="layout-selected-badge"
        :style="{ backgroundColor: primaryColor }"
      >
        <span class="i-mdi-check text-white h-3.5 w-3.5"></span>
      </div>

      <div class="mb-5">
        <div class="layout-icon-wrap" :style="getIconWrapStyle(layout.value)">
          <SvgIcon
            :name="layout.icon"
            class="layout-mode-icon"
            :color="modelValue === layout.value ? primaryColor : 'currentColor'"
          />
        </div>
      </div>

      <div class="text-center">
        <div class="inline-flex items-center justify-center gap-2">
          <span
            class="block text-base font-semibold nav-theme-text-main"
            :style="modelValue === layout.value ? { color: primaryColor } : {}"
            >{{ layout.label }}</span
          >
          <el-tooltip
            :content="layout.description"
            placement="top"
            effect="dark"
          >
            <span
              class="i-mdi-help-circle-outline h-4 w-4 cursor-help text-gray-400 transition-colors duration-150"
              :style="
                modelValue === layout.value ? { color: primaryColor } : {}
              "
              @click.stop
            ></span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'
  import SvgIcon from '@/components/SvgIcon/svgIcon.vue'

  defineOptions({
    name: 'LayoutModeCard'
  })

  const props = withDefaults(
    defineProps<{
      modelValue?: MenuNavigationType
    }>(),
    {
      modelValue: MenuNavigationType.SidebarNav
    }
  )

  const emit = defineEmits<{
    'update:modelValue': [layout: MenuNavigationType]
  }>()

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  const primaryColor = computed(() => config.value.primaryColor)

  interface LayoutModeInfo {
    icon: string
    label: string
    description: string
  }

  const layoutModeMap: Record<MenuNavigationType, LayoutModeInfo> = {
    [MenuNavigationType.SidebarNav]: {
      icon: 'sidebar-nav',
      label: '垂直',
      description: '侧边垂直菜单模式'
    },
    [MenuNavigationType.TopNav]: {
      icon: 'top-nav',
      label: '水平',
      description: '水平菜单模式，菜单全部显示在顶部'
    },
    [MenuNavigationType.DualSidebarNav]: {
      icon: 'dual-sidebar-nav',
      label: '双列菜单',
      description: '垂直双列菜单模式'
    },
    [MenuNavigationType.CombinationNav]: {
      icon: 'combination-nav',
      label: '混合垂直',
      description: '垂直水平菜单共存'
    }
  }

  const layoutModeOrder: MenuNavigationType[] = [
    MenuNavigationType.SidebarNav,
    MenuNavigationType.TopNav,
    MenuNavigationType.DualSidebarNav,
    MenuNavigationType.CombinationNav
  ]

  const layoutModes = layoutModeOrder.map((value) => ({
    value,
    ...layoutModeMap[value]
  }))

  const getCardStyle = (value: MenuNavigationType) => {
    return value === props.modelValue
      ? {
          borderColor: primaryColor.value,
          ringColor: `${primaryColor.value}40`
        }
      : {}
  }

  const getIconWrapStyle = (value: MenuNavigationType) => {
    return value === props.modelValue
      ? {
          backgroundColor: `${primaryColor.value}14`,
          boxShadow: `inset 0 0 0 1px ${primaryColor.value}2e`
        }
      : {}
  }

  const handleLayoutChange = (layout: MenuNavigationType) => {
    emit('update:modelValue', layout)
  }
</script>

<style scoped>
  .nav-theme-layout-card {
    position: relative;
    border-radius: calc(var(--ape-volo-radius));
    transition: border-color 0.18s ease, box-shadow 0.18s ease,
      transform 0.18s ease;
  }

  .nav-theme-layout-card:not(.is-selected):hover {
    border-color: var(--el-color-primary);
    box-shadow: inset 0 0 0 1px var(--el-color-primary);
    transform: translateY(-2px);
  }

  .nav-theme-layout-card.is-selected {
    box-shadow: inset 0 0 0 1px var(--el-color-primary),
      0 10px 25px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  :global(.dark) .nav-theme-layout-card.is-selected {
    box-shadow: inset 0 0 0 1px var(--el-color-primary),
      0 10px 24px rgba(0, 0, 0, 0.28);
  }

  .nav-theme-layout-card:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 4px;
  }

  .layout-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 116px;
    border-radius: calc(var(--ape-volo-radius));
    background: rgba(148, 163, 184, 0.1);
    color: #64748b;
    transition: background-color 0.18s ease, box-shadow 0.18s ease,
      color 0.18s ease, transform 0.18s ease;
  }

  .layout-selected-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 9999px;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.16);
  }

  :global(.dark) .layout-icon-wrap {
    background: rgba(148, 163, 184, 0.16);
    color: #e2e8f0;
  }

  .layout-mode-icon {
    width: 124px;
    height: 124px;
    max-width: 92%;
    max-height: 92%;
  }

  @media (max-width: 480px) {
    .grid-cols-2 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
</style>
