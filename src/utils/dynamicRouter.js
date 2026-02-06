const viewModules = import.meta.glob('../views/**/*.vue')
import IframeView from '@/components/iframe/index.vue'

/**
 * 动态处理异步路由，递归处理 children
 * @param {Array} asyncRouter 路由配置数组
 */
export function dynamicRouterHandle(asyncRouter) {
  asyncRouter.forEach((route) => {
    // 1. iframe 类型
    if (route.meta && route.meta.iframeUrl) {
      route.component = IframeView
    }
    if (typeof route.component === 'string') {
      // 支持 component 写法如 "views/home/index.vue" 或 "home/index.vue"
      route.meta = route.meta || {}
      route.meta.path = '/src/' + route.component
      route.component = dynamicImport(viewModules, route.component)
    }
    if (Array.isArray(route.children) && route.children.length) {
      dynamicRouterHandle(route.children)
    }
  })
}

/**
 * 动态匹配 import.meta.glob 导入的视图组件
 * @param {Object} dynamicViewsModules
 * @param {String} component 形如 'views/home/index.vue' 或 'home/index.vue'
 * @returns {Function|undefined}
 */
function dynamicImport(dynamicViewsModules, component) {
  let compPath = component
  // 补全 views/ 前缀
  if (!/^views\//.test(compPath)) {
    compPath = 'views/' + compPath
  }
  // 补全 .vue 后缀
  if (!/\.vue$/.test(compPath)) {
    compPath += '.vue'
  }
  // 转 glob 匹配的相对路径
  const fullPath = `../${compPath}`
  return dynamicViewsModules[fullPath]
}
