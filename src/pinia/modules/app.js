import { defineStore } from 'pinia'
import { ref, watchEffect, reactive, watch } from 'vue'
import { setBodyPrimaryColor, setCornerSize } from '@/utils/theme'
import { useDark, usePreferredDark } from '@vueuse/core'
import { MenuNavigationType } from '@/enums/MenuNavigationType'
import { BorderRadiusType } from '@/enums/BorderRadiusType'
import { TransitionType } from '@/enums/TransitionType'

/**
 * 应用程序全局状态管理 Store
 * @description 管理应用的主题、布局、设备类型等全局配置
 * @returns {Object} 应用状态和相关方法
 */
export const useAppStore = defineStore('app', () => {
  // 设备和界面状态
  const device = ref('')
  const drawerSize = ref('')
  const operateMinWith = ref('240')

  // 默认配置对象
  const defaultConfig = {
    weakness: false,
    grey: false,
    primaryColor: '#3b82f6',
    showTabs: true,
    darkMode: localStorage.getItem('vueuse-color-scheme') || 'auto',
    layoutSideWidth: 256,
    layoutSideCollapsedWidth: 80,
    layoutSideItemHeight: 48,
    showWatermark: true,
    sideMode: MenuNavigationType.SidebarNav,
    transitionType: TransitionType.Slide,
    cornerSize: BorderRadiusType.Small
  }

  // 响应式配置对象
  const config = reactive({ ...defaultConfig })

  // 从本地存储加载用户偏好设置
  const sysPreferences = JSON.parse(
    localStorage.getItem('sysPreferences') || '{}'
  )
  if (sysPreferences) {
    Object.keys(config).forEach((key) => {
      if (sysPreferences[key] !== undefined) {
        config[key] = sysPreferences[key]
      }
    })
  }

  // 监听配置变化并保存到本地存储
  watch(
    config,
    (val) => {
      localStorage.setItem('sysPreferences', JSON.stringify(val))
    },
    { deep: true }
  )

  // 暗黑模式管理
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light'
  })

  // 系统偏好的暗黑模式
  const preferredDark = usePreferredDark()

  /**
   * 切换主题模式
   * @param {boolean} darkMode - 是否为暗黑模式
   * @returns {void}
   */
  const toggleTheme = (darkMode) => {
    const sysPreferences = JSON.parse(
      localStorage.getItem('sysPreferences') || '{}'
    )
    if (darkMode) {
      sysPreferences.darkMode = 'dark'
    } else {
      sysPreferences.darkMode = 'light'
    }
    localStorage.setItem('sysPreferences', JSON.stringify(sysPreferences))
    isDark.value = darkMode
  }

  /**
   * 切换弱视模式
   * @param {boolean} e - 是否启用弱视模式
   * @returns {void}
   */
  const toggleWeakness = (e) => {
    config.weakness = e
  }

  /**
   * 切换灰度模式
   * @param {boolean} e - 是否启用灰度模式
   * @returns {void}
   */
  const toggleGrey = (e) => {
    config.grey = e
  }

  /**
   * 切换主色调
   * @param {string} e - 主色调颜色值
   * @returns {void}
   */
  const togglePrimaryColor = (e) => {
    config.primaryColor = e
  }

  /**
   * 切换标签页显示
   * @param {boolean} e - 是否显示标签页
   * @returns {void}
   */
  const toggleTabs = (e) => {
    config.showTabs = e
  }

  /**
   * 切换设备类型
   * @param {string} e - 设备类型 ('mobile' | 'desktop')
   * @returns {void}
   */
  const toggleDevice = (e) => {
    if (e === 'mobile') {
      drawerSize.value = '100%'
      operateMinWith.value = '60'
    } else {
      drawerSize.value = '800'
      operateMinWith.value = '80'
    }
    device.value = e
  }

  /**
   * 切换暗黑模式配置
   * @param {string} e - 暗黑模式设置 ('auto' | 'dark' | 'light')
   * @returns {void}
   */
  const toggleDarkMode = (e) => {
    config.darkMode = e
  }

  // 监听暗黑模式配置变化
  watchEffect(() => {
    localStorage.setItem('vueuse-color-scheme', config.darkMode)
    if (config.darkMode === 'auto') {
      isDark.value = preferredDark.value
      return
    }
    isDark.value = config.darkMode === 'dark'
  })

  /**
   * 切换侧边栏宽度
   * @param {number} e - 侧边栏宽度值
   * @returns {void}
   */
  const toggleConfigSideWidth = (e) => {
    config.layoutSideWidth = e
  }

  /**
   * 切换侧边栏收缩宽度
   * @param {number} e - 侧边栏收缩宽度值
   * @returns {void}
   */
  const toggleConfigSideCollapsedWidth = (e) => {
    config.layoutSideCollapsedWidth = e
  }

  /**
   * 切换侧边栏项目高度
   * @param {number} e - 侧边栏项目高度值
   * @returns {void}
   */
  const toggleConfigSideItemHeight = (e) => {
    config.layoutSideItemHeight = e
  }

  /**
   * 切换水印显示
   * @param {boolean} e - 是否显示水印
   * @returns {void}
   */
  const toggleConfigWatermark = (e) => {
    config.showWatermark = e
  }

  /**
   * 切换侧边栏模式
   * @param {string} e - 侧边栏模式
   * @returns {void}
   */
  const toggleSideMode = (e) => {
    config.sideMode = e
  }

  /**
   * 切换过渡动画类型
   * @param {string} e - 过渡动画类型
   * @returns {void}
   */
  const toggleTransition = (e) => {
    config.transitionType = e
  }

  /**
   * 切换圆角大小
   * @param {string} e - 圆角大小类型
   * @returns {void}
   */
  const toggleCornerSize = (e) => {
    config.cornerSize = e
  }

  /**
   * 重置配置到默认值
   * @returns {void}
   */
  const resetConfig = () => {
    for (let baseCoinfgKey in defaultConfig) {
      config[baseCoinfgKey] = defaultConfig[baseCoinfgKey]
    }
  }

  // 监听弱视和灰度模式变化，应用到DOM
  watchEffect(() => {
    document.documentElement.classList.toggle('html-weakenss', config.weakness)
    document.documentElement.classList.toggle('html-grey', config.grey)
  })

  // 监听主色调变化，应用主题色
  watchEffect(() => {
    setBodyPrimaryColor(config.primaryColor, isDark.value ? 'dark' : 'light')
  })

  // 监听圆角大小变化，应用圆角样式
  watchEffect(() => {
    setCornerSize(config.cornerSize)
  })

  return {
    isDark,
    device,
    drawerSize,
    operateMinWith,
    config,
    toggleTheme,
    toggleDevice,
    toggleWeakness,
    toggleGrey,
    togglePrimaryColor,
    toggleTabs,
    toggleDarkMode,
    toggleConfigSideWidth,
    toggleConfigSideCollapsedWidth,
    toggleConfigSideItemHeight,
    toggleConfigWatermark,
    toggleSideMode,
    toggleTransition,
    toggleCornerSize,
    resetConfig
  }
})
