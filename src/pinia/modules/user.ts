import { login, logout, getUserInfo } from '@/api/auth'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouterStore } from './router'
import { setApeToken, clearToken } from '@/utils/jwtAuth'
import router from '@/router'
import setting from '@/setting'

/**
 * 部门信息接口
 */
export interface DeptInfo {
  [key: string]: any
}

/**
 * 用户权限信息接口
 */
export interface AuthorityInfo {
  [key: string]: any
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number | string
  userName: string
  nickName: string
  headerImg: string
  authority: AuthorityInfo
  genderCode: number
  email: string
  phone: string
  dept: DeptInfo
  roleCodes: string[]
  authCodes: string[]
}

/**
 * User Store 状态接口
 */
export interface UserState {
  loadingInstance: Ref<LoadingInstance | null>
  userInfo: Ref<UserInfo>
}

const createDefaultUserInfo = (): UserInfo => ({
  id: 0,
  userName: '',
  nickName: '',
  headerImg: '',
  authority: {},
  genderCode: 0,
  email: '',
  phone: '',
  dept: {},
  roleCodes: [],
  authCodes: []
})

/**
 * 用户状态管理 Store
 * @description 管理用户信息、登录状态和相关操作
 * @returns {Object} 用户状态和相关方法
 */
export const useUserStore = defineStore('user', () => {
  // 加载状态实例
  const loadingInstance = ref<LoadingInstance | null>(null)

  // 用户信息对象
  const userInfo = ref<UserInfo>(createDefaultUserInfo())

  const closeLoading = (): void => {
    try {
      loadingInstance.value?.close?.()
    } finally {
      loadingInstance.value = null
    }
  }

  /**
   * 设置用户信息
   * @param {Partial<UserInfo>} user - 用户基本信息
   * @param {string[]} roleCodes - 角色编码数组
   * @param {string[]} authCodes - 权限编码数组
   * @returns {void}
   */
  const setUserInfo = (
    user: Partial<UserInfo>,
    roleCodes: string[],
    authCodes: string[]
  ): void => {
    userInfo.value = {
      ...userInfo.value,
      ...user,
      roleCodes,
      authCodes
    }
  }

  /**
   * 重置用户信息
   * @param {Partial<UserInfo>} value - 要更新的用户信息字段，默认为空对象
   * @returns {void}
   */
  const ResetUserInfo = (value: Partial<UserInfo> = {}): void => {
    userInfo.value = {
      ...userInfo.value,
      ...value
    }
  }

  /**
   * 获取用户信息
   * @returns {Promise<any>} 返回用户信息的Promise对象
   */
  const GetUserInfo = async (): Promise<any> => {
    const res = await getUserInfo()
    if (res?.data?.user) {
      setUserInfo(res.data.user, res.data.roleCodes, res.data.authCodes)
    }
    return res
  }

  /**
   * 系统登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} captcha - 验证码
   * @param {string} captchaId - 验证码ID
   * @returns {Promise<boolean>} 登录成功返回true，失败返回false
   */
  const LoginIn = async (
    username: string,
    password: string,
    captcha: string,
    captchaId: string
  ): Promise<boolean> => {
    try {
      closeLoading()
      // 显示全屏加载状态
      loadingInstance.value = ElLoading.service({
        fullscreen: true,
        text: '登录中，请稍候...'
      })

      // 调用登录API
      const res = await login(username, password, captcha, captchaId)

      // 设置用户信息和权限
      setUserInfo(res.data.user, res.data.roleCodes, res.data.authCodes)
      setApeToken(res.data.token)

      // 初始化路由信息
      const routerStore = useRouterStore()
      await routerStore.SetAsyncRouter()
      const asyncRouters = routerStore.asyncRouters

      // 注册到路由表里
      asyncRouters.forEach((asyncRouter) => {
        router.addRoute(asyncRouter)
      })

      // 处理重定向或默认页面跳转
      if (router.currentRoute.value.query.redirect) {
        await router.replace(router.currentRoute.value.query.redirect as string)
        return true
      }
      const defaultRouter = setting.defaultRouter
      if (!router.hasRoute(defaultRouter)) {
        ElMessage.error('请联系管理员进行授权')
      } else {
        await router.replace({ name: defaultRouter })
      }

      // 检测操作系统类型并保存
      const isWindows = /windows/i.test(navigator.userAgent)
      window.localStorage.setItem('osType', isWindows ? 'WIN' : 'MAC')

      // 显示登录成功通知
      ElNotification({
        title: '登录成功',
        message: '欢迎回来:' + username,
        type: 'success'
      })
      return true
    } catch (error) {
      console.error('LoginIn error:', error)
      return false
    } finally {
      closeLoading()
    }
  }

  /**
   * 用户登出
   * @returns {Promise<void>} 无返回值的Promise
   */
  const LoginOut = async (): Promise<void> => {
    try {
      await logout()
    } catch (error) {
      console.warn('LoginOut logout error:', error)
    } finally {
      closeLoading()
      clearToken()
      ClearStorage()
      router.replace({ name: 'Login' })
      window.location.reload()
    }
  }

  /**
   * 清除本地存储数据
   * @returns {void}
   */
  const ClearStorage = (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('ClearStorage localStorage error:', error)
    }

    try {
      sessionStorage.clear()
    } catch (error) {
      console.warn('ClearStorage sessionStorage error:', error)
    }
  }

  return {
    userInfo,
    ResetUserInfo,
    GetUserInfo,
    LoginIn,
    LoginOut,
    loadingInstance,
    ClearStorage
  }
})
