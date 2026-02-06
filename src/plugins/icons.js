import { h } from 'vue'

import * as ElIconModules from '@element-plus/icons-vue'
import svgIcon from '@/components/svgIcon/svgIcon.vue'

/**
 * 创建SVG图标组件
 * @param {string} name - 图标名称
 * @returns {Object} Vue组件对象
 * @description 动态创建一个使用指定名称的SVG图标组件
 */
const createIconComponent = (name) => ({
  name: 'SvgIcon',
  render() {
    return h(svgIcon, {
      name: name
    })
  }
})

/**
 * 注册自定义SVG图标组件
 * @param {Object} app - Vue应用实例
 * @returns {Promise<void>} 无返回值的Promise
 * @description 扫描assets/icons目录下的SVG文件并注册为全局组件
 */
const registerIcons = async (app) => {
  // 使用Vite的glob导入功能获取所有SVG文件
  const iconModules = import.meta.glob('@/assets/icons/**/*.svg')
  const mergedIconModules = Object.assign({}, iconModules)

  // 遍历所有SVG文件路径
  for (const path in mergedIconModules) {
    // 从文件路径中提取图标名称
    const iconName = path
      .split('/')
      .pop()
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
 * 设置图标系统
 * @param {Object} app - Vue应用实例
 * @returns {void}
 * @description 初始化图标系统，注册Element Plus图标和自定义SVG图标
 */
export const setupIcons = (app) => {
  // 注册所有Element Plus图标组件
  for (const iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
  }

  // 注册SVG图标组件
  app.component('SvgIcon', svgIcon)

  // 注册自定义SVG图标
  registerIcons(app)
}
