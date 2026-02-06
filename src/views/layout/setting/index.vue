<template>
  <div @click="openSettingModal">
    <el-tooltip class="" effect="dark" content="系统设置" placement="bottom">
      <el-icon
        class="w-8 h-8 shadow rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer border-solid"
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
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">系统配置</span>
          <el-button @click="resetConfig">
            <el-icon><RefreshRight /></el-icon>
            重置
          </el-button>
        </div>
      </template>
      <div class="flex flex-col">
        <div class="mb-8">
          <Title title="主题模式" />
          <ThemeSegmented v-model="config.darkMode" />
        </div>

        <div class="mb-8">
          <Title title="内置颜色"></Title>
          <ThemeColor
            v-model="config.primaryColor"
            :color-value="config.primaryColor"
          />
        </div>

        <div class="mb-8">
          <Title title="布局方式" />
          <LayoutMode
            v-model="config.sideMode"
            :side-mode-value="config.sideMode"
          />
        </div>

        <div class="mb-8">
          <Title title="圆角"></Title>
          <RoundMode
            v-model="config.cornerSize"
            :corner-size-value="config.cornerSize"
          />
        </div>

        <div class="mb-8">
          <Title title="通用配置"></Title>
          <div class="mt-2 text-md p-2 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div>展示水印</div>
              <el-switch
                v-model="config.showWatermark"
                @change="appStore.toggleConfigWatermark"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>显示标签页</div>
              <el-switch
                v-model="config.showTabs"
                @change="appStore.toggleTabs"
              />
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex-shrink-0">页面切换动画</div>
              <el-select
                v-model="config.transitionType"
                @change="appStore.toggleTransition"
                class="w-40"
              >
                <el-option
                  v-for="opt in transitionOptions"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.label"
                />
              </el-select>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <Title title="layout 大小配置"></Title>
          <div class="mt-2 text-md p-2 flex flex-col gap-2">
            <div class="flex items-center justify-between mb-2">
              <div>侧边栏展开宽度</div>
              <el-input-number
                v-model="config.layoutSideWidth"
                :min="150"
                :max="400"
                :step="10"
              ></el-input-number>
            </div>
            <div class="flex items-center justify-between mb-2">
              <div>侧边栏收缩宽度</div>
              <el-input-number
                v-model="config.layoutSideCollapsedWidth"
                :min="60"
                :max="100"
              ></el-input-number>
            </div>
            <div class="flex items-center justify-between mb-2">
              <div>侧边栏子项高度</div>
              <el-input-number
                v-model="config.layoutSideItemHeight"
                :min="30"
                :max="50"
              ></el-input-number>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <Title title="其他" />
          <div class="mt-2 text-md p-2 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div>灰色模式</div>
              <el-switch v-model="config.grey" @change="appStore.toggleGrey" />
            </div>
            <div class="flex items-center justify-between">
              <div>色弱模式</div>
              <el-switch
                v-model="config.weakness"
                @change="appStore.toggleWeakness"
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import { useAppStore } from '@/pinia'
  import { TransitionType } from '@/enums/TransitionType'
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { ElNotification } from 'element-plus'
  import Title from './title.vue'
  import { watch } from 'vue'
  import ThemeSegmented from './themeMode.vue'
  import ThemeColor from './ThemeColor.vue'
  import LayoutMode from './layoutMode.vue'
  import RoundMode from './roundMode.vue'

  const appStore = useAppStore()
  const { config, device } = storeToRefs(appStore)
  defineOptions({
    name: 'SysSetting'
  })

  const isModalVisible = ref(false)

  const transitionOptions = ref([])

  const loadTransitionOptions = () => {
    const labelMap = {
      [TransitionType.Slide]: '滑动',
      [TransitionType.Fade]: '淡入淡出',
      [TransitionType.Zoom]: '缩放',
      [TransitionType.None]: '无动画'
    }

    return Object.values(TransitionType).map((value) => ({
      value,
      label: labelMap[value] ?? value
    }))
  }

  transitionOptions.value = loadTransitionOptions()

  function openSettingModal() {
    isModalVisible.value = true
  }

  const width = computed(() => {
    return device.value === 'mobile' ? '100%' : '500px'
  })

  const saveConfig = async () => {
    localStorage.setItem('sysPreferences', JSON.stringify(config.value))
    ElNotification({
      message: '设置成功',
      type: 'success'
    })
  }

  const resetConfig = () => {
    appStore.resetConfig()
  }

  watch(
    config,
    async () => {
      await saveConfig()
    },
    { deep: true }
  )
</script>

<style lang="scss" scoped>
  ::v-deep(.el-drawer__header) {
    @apply border-gray-400 dark:border-gray-600;
  }
</style>
