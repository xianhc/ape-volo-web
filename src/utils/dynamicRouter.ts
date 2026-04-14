import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import IframeView from '@/components/Iframe/index.vue'

/**
 * Vue 组件模块映射类型
 */
type ComponentModule = Record<string, () => Promise<Component>>

/**
 * 路由元信息接口
 * @interface RouteMeta
 */
export interface RouteMeta extends Record<string | number | symbol, unknown> {
  iframeUrl?: string
  path?: string
  [key: string]: any
}

/**
 * 扩展的路由记录接口
 * @interface AsyncRouteRecordRaw
 */
export interface AsyncRouteRecordRaw
  extends Omit<RouteRecordRaw, 'component' | 'children' | 'meta'> {
  component?: Component | string | (() => Promise<Component>)
  meta?: RouteMeta
  children?: AsyncRouteRecordRaw[]
}

/**
 * 获取所有 Vue 视图组件
 */
const viewModules = import.meta.glob('../views/**/*.vue') as ComponentModule

/**
 * 动态处理异步路由，递归处理 children
 * @function dynamicRouterHandle
 * @description 将后端返回的路由配置转换为前端可用的路由对象
 *
 * 处理逻辑：
 * - 处理 iframe 类型路由
 * - 将字符串类型的 component 转换为动态导入函数
 * - 递归处理子路由
 *
 * @param {AsyncRouteRecordRaw[]} asyncRouter - 路由配置数组
 *
 * @example
 * const routes = [
 *   {
 *     path: '/user',
 *     component: 'user/index.vue',
 *     children: [...]
 *   }
 * ]
 * dynamicRouterHandle(routes)
 */
export function dynamicRouterHandle(asyncRouter: AsyncRouteRecordRaw[]): void {
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
 * @function dynamicImport
 * @description 根据组件路径动态导入 Vue 组件
 *
 * 路径处理：
 * - 自动补全 'views/' 前缀
 * - 自动补全 '.vue' 后缀
 * - 转换为 glob 匹配的相对路径
 *
 * @param {ComponentModule} dynamicViewsModules - 动态视图模块映射
 * @param {string} component - 组件路径，形如 'views/home/index.vue' 或 'home/index.vue'
 * @returns {(() => Promise<Component>) | undefined} 动态导入函数
 *
 * @example
 * const loader = dynamicImport(viewModules, 'home/index.vue')
 * // 返回: () => import('../views/home/index.vue')
 */
function dynamicImport(
  dynamicViewsModules: ComponentModule,
  component: string
): (() => Promise<Component>) | undefined {
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
