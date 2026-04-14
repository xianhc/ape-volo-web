import type { App, Component } from 'vue'
import { h } from 'vue'
import * as ElIconModules from '@element-plus/icons-vue'
import svgIcon from '@/components/SvgIcon/svgIcon.vue'

/**
 * 创建SVG图标组件
 * @param {string} name - 图标名称
 * @returns {Component} Vue组件对象
 * @description 动态创建一个使用指定名称的SVG图标组件
 */
const createIconComponent = (name: string): Component => ({
  name: 'SvgIcon',
  render() {
    return h(svgIcon, {
      name: name
    })
  }
})

/**
 * 注册自定义SVG图标组件
 * @param {App} app - Vue应用实例
 * @returns {Promise<void>} 无返回值的Promise
 * @description 扫描assets/icons目录下的SVG文件并注册为全局组件
 */
const registerIcons = async (app: App): Promise<void> => {
  // 使用Vite的glob导入功能获取所有SVG文件
  const iconModules = (import.meta as any).glob('@/assets/icons/**/*.svg')
  const mergedIconModules = Object.assign({}, iconModules)

  // 遍历所有SVG文件路径
  for (const path in mergedIconModules) {
    // 从文件路径中提取图标名称
    const iconName = path
      .split('/')
      .pop()!
      .replace(/\.svg$/, '')

    // 检查图标名称是否包含空格，如有则跳过并输出错误
    if (iconName.indexOf(' ') !== -1) {
      console.error(`icon ${iconName}.svg includes whitespace in ${path}`)
      continue
    }

    // 创建图标组件并注册为全局组件
    const iconComponent = createIconComponent(iconName)
    app.component(iconName, iconComponent)
  }
}

/**
 * 注册Element Plus图标
 * @param {App} app - Vue应用实例
 * @returns {void}
 * @description 注册所有Element Plus图标为全局组件
 */
const registerElementPlusIcons = (app: App): void => {
  for (const [key, component] of Object.entries(ElIconModules)) {
    app.component(key, component)
  }
}

/**
 * 设置图标
 * @param {App} app - Vue应用实例
 * @returns {Promise<void>} 无返回值的Promise
 * @description 注册所有图标组件
 */
export const setupIcons = async (app: App): Promise<void> => {
  // 注册Element Plus图标
  registerElementPlusIcons(app)
  // 注册自定义SVG图标
  await registerIcons(app)
}
