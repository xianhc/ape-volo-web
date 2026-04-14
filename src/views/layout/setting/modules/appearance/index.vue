<template>
  <div class="ape-theme-font">
    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">界面模式</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <ThemeModeSelector
          v-model="config.darkMode"
          @update:model-value="appStore.toggleDarkMode"
        />
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">主题主色</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <ThemeColorPicker
          v-model="config.primaryColor"
          @update:model-value="appStore.togglePrimaryColor"
        />
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">尺寸与圆角</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <PreferenceItem label="组件尺寸">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >统一调整按钮、输入框和表单控件的默认尺寸</span
              >
            </template>
            <div class="w-39">
              <el-select
                v-model="config.componentSize"
                placeholder="请选择组件尺寸"
                @change="appStore.toggleComponentSize"
              >
                <el-option
                  v-for="option in componentSizeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
          </PreferenceItem>

          <PreferenceItem label="圆角半径">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >统一调整卡片、按钮和输入框的圆角风格</span
              >
            </template>
            <div class="w-39">
              <el-select
                v-model="config.cornerSize"
                placeholder="请选择圆角尺寸"
                @change="appStore.toggleCornerSize"
              >
                <el-option
                  v-for="option in cornerSizeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
          </PreferenceItem>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">可读性与辅助</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <PreferenceItem label="灰度模式">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >以低饱和度方式显示页面内容</span
              >
            </template>
            <el-switch v-model="config.grey" @change="appStore.toggleGrey" />
          </PreferenceItem>

          <PreferenceItem label="色弱辅助">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >增强界面中的关键色彩对比</span
              >
            </template>
            <el-switch
              v-model="config.weakness"
              @change="appStore.toggleWeakness"
            />
          </PreferenceItem>

          <PreferenceItem label="页面水印">
            <template #suffix>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-2"
                >在工作区内容上显示身份标识水印</span
              >
            </template>
            <el-switch
              v-model="config.showWatermark"
              @change="appStore.toggleConfigWatermark"
            />
          </PreferenceItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  import { BorderRadiusType } from '@/enums/BorderRadiusType'
  import { ComponentSizeType } from '@/enums/ComponentSizeType'
  import ThemeModeSelector from '../../components/themeModeSelector.vue'
  import ThemeColorPicker from '../../components/themeColorPicker.vue'
  import PreferenceItem from '../../components/preferenceItem.vue'

  defineOptions({
    name: 'AppearanceSettings'
  })

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  interface SelectOption {
    value: string | number
    label: string
  }

  const buildComponentSizeOptions = (): SelectOption[] => {
    const labelMap: Record<string, string> = {
      [ComponentSizeType.Default]: '默认尺寸',
      [ComponentSizeType.Large]: '宽松尺寸',
      [ComponentSizeType.Small]: '紧凑尺寸'
    }

    return (Object.values(ComponentSizeType) as string[]).map((value) => ({
      value,
      label: labelMap[value] ?? value
    }))
  }

  const buildCornerSizeOptions = (): SelectOption[] => {
    const labelMap: Partial<Record<BorderRadiusType, string>> = {
      [BorderRadiusType.None]: '无圆角',
      [BorderRadiusType.Small]: '小圆角',
      [BorderRadiusType.Medium]: '中圆角',
      [BorderRadiusType.Large]: '大圆角',
      [BorderRadiusType.Full]: '超大圆角'
    }

    return (
      Object.values(BorderRadiusType).filter(
        (v): v is number => typeof v === 'number'
      ) as BorderRadiusType[]
    ).map((value) => ({
      value,
      label: labelMap[value] ?? String(value)
    }))
  }

  const componentSizeOptions = buildComponentSizeOptions()
  const cornerSizeOptions = buildCornerSizeOptions()
</script>
