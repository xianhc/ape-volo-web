import { dynamicRouterHandle } from '@/utils/dynamicRouter'
import { emitter } from '@/utils/bus.js'
import { build } from '@/api/permission/menu'
import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import pathInfo from '@/plugins/pathInfo.json'
import { useRoute } from 'vue-router'
import { MenuType } from '@/enums/MenuType'

// 需要缓存的路由数组
const keepAliveRoutersArr = []
// 路由名称映射表
const nameMap = {}

// keep-alive 的 include 匹配组件名是区分大小写的，这里做一次“规范化”，让 job / Job 都能命中到 Job
const componentNameCaseMap = (() => {
  const map = Object.create(null)
  Object.values(pathInfo).forEach((name) => {
    if (!name) return
    map[String(name).toLowerCase()] = String(name)
  })
  return map
})()

const canonicalizeComponentName = (name) => {
  if (!name) return name
  const key = String(name).toLowerCase()
  return componentNameCaseMap[key] || String(name)
}

/**
 * 格式化路由数据
 * @param {Array} routes - 路由数组
 * @param {Object} routeMap - 路由映射对象
 * @param {Object} parent - 父级路由
 * @returns {void}
 */
const formatRouter = (routes, routeMap, parent) => {
  routes &&
    routes.forEach((item) => {
      item.parent = parent
      item.meta = item.meta || {}
      item.meta.hidden = item.hidden

      // 处理内部链接类型菜单
      if (item.menuType === MenuType.InternalLink) {
        item.meta.iframeUrl = item.component
      }
      // 处理外部链接类型菜单
      if (item.menuType === MenuType.ExternalLink) {
        item.name = item.component
      }
      // 添加到路由映射表
      routeMap[item.name] = item
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap, item)
      }
    })
}

const resolveKeepAliveComponentName = (item) => {
  const metaPath = item?.meta?.path
  const byPath = metaPath ? pathInfo[metaPath] : undefined
  const raw = byPath || item?.name
  return canonicalizeComponentName(raw)
}

/**
 * 过滤需要缓存的路由
 * @param {Array} routes - 路由数组
 * @returns {void}
 */
const KeepAliveFilter = (routes) => {
  routes &&
    routes.forEach((item) => {
      if (
        (item.children && item.children.some((ch) => ch.meta?.keepAlive)) ||
        item.meta?.keepAlive
      ) {
        const compName = resolveKeepAliveComponentName(item)
        if (compName) {
          keepAliveRoutersArr.push(compName)
          // route.name 也是区分大小写的，这里同时记录原始与小写 key，提升兼容性
          nameMap[item.name] = compName
          if (typeof item.name === 'string') {
            nameMap[item.name.toLowerCase()] = compName
          }
        }
      }
      // 递归处理子路由
      if (item.children && item.children.length > 0) {
        KeepAliveFilter(item.children)
      }
    })
}

/**
 * 路由状态管理 Store
 * @description 管理动态路由、菜单导航和路由缓存
 * @returns {Object} 路由状态和相关方法
 */
export const useRouterStore = defineStore('router', () => {
  // 需要缓存的路由组件数组
  const keepAliveRouters = ref([])
  // 异步路由标志，用于触发路由更新
  const asyncRouterFlag = ref(0)

  /**
   * 设置需要缓存的路由
   * @param {Array} history - 路由历史记录
   * @returns {void}
   */
  const setKeepAliveRouters = (history) => {
    const keepArrTemp = []

    const pushByRouteName = (routeName) => {
      if (nameMap[routeName]) {
        keepArrTemp.push(nameMap[routeName])
      }
    }

    history.forEach((item) => {
      if (!item?.name) return
      // 叶子页（Job/Menu/...）
      pushByRouteName(item.name)

      // 父级容器页（Permission/System/...）也要进 include
      let parent = routeMap[item.name]?.parent
      while (parent) {
        pushByRouteName(parent.name)
        parent = parent.parent
      }
    })
    // 去重并更新缓存路由数组：
    // - keepAliveRoutersArr：从后端菜单中筛出的“允许缓存”的页面（基础集合）
    // - keepArrTemp：Tabs/历史里当前需要缓存的页面（增量集合）
    // 合并后避免被空 history 覆盖成 []
    keepAliveRouters.value = Array.from(
      new Set([...keepAliveRoutersArr, ...keepArrTemp].filter(Boolean))
    )
  }

  const route = useRoute()

  // 监听设置缓存事件
  emitter.on('setKeepAlive', setKeepAliveRouters)

  // 异步路由数组
  const asyncRouters = ref([])

  // 顶部菜单数组
  const topMenu = ref([])

  // 左侧菜单数组
  const leftMenu = ref([])

  // 菜单映射对象
  const menuMap = {}

  // 当前激活的顶部菜单
  const topActive = ref('')

  /**
   * 设置左侧菜单
   * @param {string} name - 顶部菜单名称
   * @returns {Array} 左侧菜单数组
   */
  const setLeftMenu = (name) => {
    // 保存到会话存储
    sessionStorage.setItem('topActive', name)
    topActive.value = name
    leftMenu.value = []
    // 设置对应的左侧菜单
    if (menuMap[name]?.children) {
      leftMenu.value = menuMap[name].children
    }
    return menuMap[name]?.children
  }

  /**
   * 根据路由名称查找对应的顶部菜单
   * @param {Object} menuMap - 菜单映射对象
   * @param {string} routeName - 路由名称
   * @returns {string|null} 顶部菜单名称
   */
  const findTopActive = (menuMap, routeName) => {
    for (let topName in menuMap) {
      const topItem = menuMap[topName]
      // 检查直接子菜单
      if (topItem.children?.some((item) => item.name === routeName)) {
        return topName
      }
      // 递归检查深层子菜单
      const foundName = findTopActive(topItem.children || {}, routeName)
      if (foundName) {
        return topName
      }
    }
    return null
  }

  // 监听路由变化，自动设置菜单
  watchEffect(() => {
    let topActive = sessionStorage.getItem('topActive')
    // 初始化菜单内容，防止重复添加
    topMenu.value = []
    asyncRouters.value[0]?.children.forEach((item) => {
      if (item.hidden) return
      menuMap[item.name] = item
      topMenu.value.push({ ...item, children: [] })
    })
    // 如果没有激活的顶部菜单，自动查找
    if (!topActive || topActive === 'undefined' || topActive === 'null') {
      topActive = findTopActive(menuMap, route.name)
    }
    setLeftMenu(topActive)
  })

  // 路由映射对象
  const routeMap = {}

  /**
   * 从后台获取并设置动态路由
   * @returns {Promise<boolean>} 设置成功返回true
   */
  const SetAsyncRouter = async () => {
    // 增加异步路由标志，触发相关组件更新
    asyncRouterFlag.value++

    // 重置 keep-alive 相关映射，避免重复加载/热更新导致脏数据
    keepAliveRoutersArr.length = 0
    for (const key in nameMap) {
      delete nameMap[key]
    }
    for (const key in routeMap) {
      delete routeMap[key]
    }

    // 基础路由结构
    const baseRouter = [
      {
        path: '/layout',
        name: 'layout',
        component: 'views/layout/index.vue',
        meta: {
          title: '底层layout'
        },
        children: []
      }
    ]

    // 从后台获取菜单数据
    const resMenu = await build()
    const asyncRouter = resMenu.data

    // 添加重载页面路由
    asyncRouter &&
      asyncRouter.push({
        path: 'reload',
        name: 'Reload',
        hidden: true,
        meta: {
          title: '',
          closeTab: true
        },
        component: 'views/error/reload.vue'
      })

    // 格式化路由数据
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter

    // 处理动态路由
    dynamicRouterHandle(baseRouter)

    // 过滤缓存路由
    KeepAliveFilter(asyncRouter)

    // 初始化 keep-alive include：即使不打开 Tabs（不触发 setKeepAlive 事件），也能命中缓存
    keepAliveRouters.value = Array.from(
      new Set(keepAliveRoutersArr.filter(Boolean))
    )

    // 保存路由数据
    asyncRouters.value = baseRouter
    return true
  }

  return {
    topActive,
    setLeftMenu,
    topMenu,
    leftMenu,
    asyncRouters,
    keepAliveRouters,
    asyncRouterFlag,
    SetAsyncRouter,
    routeMap
  }
})
