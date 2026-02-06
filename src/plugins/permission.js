import { useUserStore } from '@/pinia/modules/user'
import { useRouterStore } from '@/pinia/modules/router'
import getPageTitle from '@/utils/index'
import { getApeToken } from '@/utils/jwtAuth'
import setting from '@/setting'
import router from '@/router'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const defaultRouter = setting.defaultRouter

/**
 * 设置权限管理系统
 * @description 配置路由守卫、权限验证和页面访问控制
 * @returns {void}
 */
export function setupPermission() {
  // 白名单路由，无需登录即可访问
  const WHITE_LIST = ['Login']

  // 仅移除一次初始 loading，避免重复操作 DOM
  let loadingRemoved = false
  const removeLoadingOnce = () => {
    if (loadingRemoved) return
    loadingRemoved = true
    const element = document.getElementById('loading-box')
    element?.remove()
  }

  /**
   * 全局前置路由守卫
   * @description 处理权限验证、路由重定向和页面访问控制
   */
  router.beforeEach(async (to, from) => {
    try {
      const userStore = useUserStore()
      const routerStore = useRouterStore()
      const apeToken = getApeToken()

      // 开始进度条
      Nprogress.start()

      // 处理元数据和缓存
      to.meta.matched = [...to.matched]
      await handleKeepAlive(to)

      // 设置页面标题
      document.title = getPageTitle(to.meta.title, to)

      // 客户端路由直接放行
      if (to.meta.client) {
        return true
      }

      // 白名单路由处理
      if (WHITE_LIST.includes(to.name)) {
        if (apeToken.accessToken) {
          // 已登录用户访问登录页，重定向到默认页面
          if (!routerStore.asyncRouterFlag) {
            await setupRouter(userStore)
          }
          return { name: defaultRouter }
        }
        return true
      }

      // 需要登录的路由处理
      if (apeToken.accessToken) {
        // 处理异步路由
        if (!routerStore.asyncRouterFlag && !WHITE_LIST.includes(from.name)) {
          const setupSuccess = await setupRouter(userStore)

          if (setupSuccess && apeToken.accessToken) {
            return handleRedirect(to)
          }

          return {
            name: 'Login',
            query: { redirect: to.fullPath }
          }
        }

        // 验证路由是否存在
        return to.matched.length ? true : { path: '/layout/404' }
      }

      // 未登录用户重定向到登录页
      return {
        name: 'Login',
        query: {
          redirect: to.fullPath
        }
      }
    } catch (error) {
      console.error('Router beforeEach error:', error)
      Nprogress.done()
      removeLoadingOnce()
      return false
    }
  })

  /**
   * 全局后置路由守卫
   * @description 路由切换完成后的处理
   */
  router.afterEach(() => {
    // 首次成功切换路由后移除初始 loading
    removeLoadingOnce()
    // 完成进度条
    Nprogress.done()
  })

  /**
   * 路由错误处理
   * @description 处理路由跳转过程中的错误
   */
  router.onError((error) => {
    console.error('Router error:', error)
    // 移除进度条
    Nprogress.remove()
    removeLoadingOnce()
  })
}

// 配置进度条样式
Nprogress.configure({
  showSpinner: false, // 隐藏加载旋转器
  ease: 'ease', // 动画效果
  speed: 500 // 动画速度
})

/**
 * 设置路由和用户信息
 * @param {Object} userStore - 用户状态管理实例
 * @returns {Promise<boolean>} 设置成功返回true，失败返回false
 * @description 异步加载路由配置和用户信息
 */
const setupRouter = async (userStore) => {
  try {
    const routerStore = useRouterStore()
    // 并行加载路由配置和用户信息
    await Promise.all([routerStore.SetAsyncRouter(), userStore.GetUserInfo()])

    // 注册动态路由
    routerStore.asyncRouters.forEach((route) => router.addRoute(route))
    return true
  } catch (error) {
    console.error('Setup router failed:', error)
    return false
  }
}

/**
 * 处理路由缓存
 * @param {Object} to - 目标路由对象
 * @returns {Promise<void>} 无返回值的Promise
 * @description 处理需要缓存的路由组件
 */
const handleKeepAlive = async (to) => {
  // 如果路由不需要缓存，直接返回
  if (!to.matched.some((item) => item.meta.keepAlive)) return

  // 只做异步组件预加载：不要 splice matched（会破坏 router-view 层级与缓存）
  for (const record of to.matched) {
    const loader = record?.components?.default
    if (typeof loader === 'function') {
      try {
        await loader()
      } catch (e) {
        console.warn('Preload keepAlive component failed:', e)
      }
    }
  }
}

/**
 * 处理路由重定向
 * @param {Object} to - 目标路由对象
 * @returns {Object} 重定向路由对象
 * @description 根据默认路由配置处理重定向逻辑
 */
const handleRedirect = (to) => {
  // 检查默认路由是否存在
  if (router.hasRoute(defaultRouter)) {
    return { ...to, replace: true }
  }
  // 默认路由不存在，跳转到404页面
  return { path: '/layout/404' }
}
