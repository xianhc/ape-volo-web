/**
 * HTTP 请求工具模块
 * 基于 Axios 封装的统一请求处理工具，提供完整的请求/响应拦截、错误处理和令牌管理功能
 *
 * 功能特性：
 * - 统一的 API 请求配置和管理
 * - 自动的 JWT 令牌认证和刷新
 * - 智能的加载状态管理
 * - 完善的错误处理和用户提示
 * - 请求/响应拦截器
 * - 网络异常处理
 *
 * 核心机制：
 * - 令牌过期自动刷新
 * - 并发请求的加载状态合并
 * - 失败请求的重试队列
 * - Blob 类型响应的特殊处理
 *
 * 使用场景：
 * - 所有 API 接口调用
 * - 文件上传下载
 * - 认证状态管理
 * - 错误信息展示
 */

import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import router from '@/router/index'
import { ElLoading } from 'element-plus'
import setting from '@/setting'
import { getApeToken, setApeToken, clearToken } from '@/utils/jwtAuth'
import { refreshToken } from '@/api/auth'

/**
 * Axios 实例配置
 * @description 创建预配置的 Axios 实例，设置基础 URL 和超时时间
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // 从环境变量获取 API 基础地址
  timeout: setting.timeout // 从配置文件获取请求超时时间
})

// 加载状态管理变量
let activeAxios = 0 // 活跃的请求数量计数器
let timer // 加载延迟定时器
let loadingInstance // Element Plus 加载实例

/**
 * 显示全局加载状态
 * @function showLoading
 * @description 智能管理全局加载状态，避免频繁的加载状态切换
 *
 * 设计理念：
 * - 使用计数器管理并发请求
 * - 延迟显示加载状态，避免闪烁
 * - 支持自定义加载目标元素
 *
 * @param {Object} [option={}] - 加载配置选项
 * @param {HTMLElement|null} [option.target=null] - 加载遮罩的目标元素，默认为基础加载容器
 *
 * @example
 * // 默认全屏加载
 * showLoading()
 *
 * // 指定容器加载
 * showLoading({ target: document.getElementById('my-container') })
 */
const showLoading = (
  option = {
    target: null
  }
) => {
  const loadDom = document.getElementById('base-load-dom')
  activeAxios++ // 增加活跃请求计数

  // 清除之前的定时器，避免重复创建加载实例
  if (timer) {
    clearTimeout(timer)
  }

  // 延迟 400ms 显示加载状态，避免快速请求的加载闪烁
  timer = setTimeout(() => {
    if (activeAxios > 0) {
      if (!option.target) option.target = loadDom
      loadingInstance = ElLoading.service(option)
    }
  }, 400)
}

/**
 * 关闭全局加载状态
 * @function closeLoading
 * @description 智能管理加载状态的关闭，确保所有请求完成后才关闭加载
 *
 * 设计理念：
 * - 递减请求计数器
 * - 只有当所有请求完成时才关闭加载
 * - 清理定时器，防止内存泄漏
 */
const closeLoading = () => {
  activeAxios-- // 减少活跃请求计数

  // 当所有请求都完成时，关闭加载状态
  if (activeAxios <= 0) {
    clearTimeout(timer)
    loadingInstance && loadingInstance.close()
  }
}

/**
 * 请求拦截器
 * @description 在发送请求前进行统一处理，添加认证头、加载状态等
 */
service.interceptors.request.use(
  (config) => {
    // 根据配置决定是否显示加载状态
    if (!config.donNotShowLoading) {
      showLoading(config.loadingOption)
    }

    // 获取当前存储的认证令牌
    var apeToken = getApeToken()
    if (apeToken != null) {
      const nowTime = Date.now()
      const expireTime = apeToken.expires

      // 检查令牌是否未过期，如果有效则添加到请求头
      if (nowTime < expireTime) {
        config.headers[
          'Authorization'
        ] = `${apeToken.tokenType} ${apeToken.accessToken}`
      }
    }

    // 设置默认的请求内容类型
    config.headers['Content-Type'] = 'application/json'

    // 构建标识：用于分发溯源（公开信息），不包含任何用户/设备指纹
    const buildTag = import.meta.env.VITE_BUILD_TAG
    if (buildTag) {
      config.headers['X-Client-Build'] = buildTag
    }
    return config
  },
  (error) => {
    // 请求错误时关闭加载状态并显示错误信息
    if (!error.config.donNotShowLoading) {
      closeLoading()
    }
    ElMessage({
      showClose: true,
      message: error,
      type: 'error'
    })
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * @description 统一处理响应结果，包括成功响应和错误处理
 */
service.interceptors.response.use(
  (response) => {
    // 成功响应时关闭加载状态
    if (!response.config.donNotShowLoading) {
      closeLoading()
    }
    return response
  },
  (error) => {
    // 错误响应时关闭加载状态
    if (!error.config.donNotShowLoading) {
      closeLoading()
    }

    // 处理网络错误（无响应对象）
    if (!error.response) {
      ElMessage.error(error?.message || '网络错误，请稍后再试')
      return Promise.reject(error)
    }

    let message = ''
    const status = error.response.status

    // HTTP 状态码对应的错误信息映射
    const statusMessageMap = {
      400: '请求错误',
      500: '服务器内部错误',
      404: '请求的资源未找到',
      403: '没有权限访问此资源'
    }

    /**
     * 处理 Blob 类型的错误响应
     * @description 当下载文件等操作出错时，服务器可能返回 JSON 格式的错误信息包装在 Blob 中
     */
    if (
      error.response.data instanceof Blob &&
      error.response.data.type.toLowerCase().indexOf('json') !== -1
    ) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function () {
        message = JSON.parse(reader.result).message
        ElMessage.error(message || statusMessageMap[status] || '请求失败')
      }
    } else {
      message = error.response.data.message

      // 401 未授权状态特殊处理 - 尝试刷新令牌
      if (status === 401) {
        return handleTokenRefresh(error.config)
      }

      // 403 无权限：跳转到 403 页面
      if (status === 403 && router.currentRoute.value.path !== '/403') {
        router.replace({ path: '/403' })
      }

      // 显示对应的错误信息
      ElMessage.error(message || statusMessageMap[status] || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default service

/**
 * 令牌刷新状态管理
 */
let isRefreshing = false // 是否正在刷新令牌的标志
let failedQueue = [] // 令牌刷新期间失败请求的重试队列

/**
 * 处理令牌刷新逻辑
 * @function handleTokenRefresh
 * @description 当遇到 401 未授权错误时，自动尝试刷新令牌并重试失败的请求
 *
 * 核心机制：
 * - 防止并发刷新：使用 isRefreshing 标志确保同时只有一个刷新操作
 * - 请求队列：将刷新期间的失败请求加入队列，刷新成功后批量重试
 * - 令牌过期检查：验证刷新令牌是否仍然有效
 * - 自动登出：刷新失败时清除令牌并重定向到登录页
 *
 * @param {Object} config - 失败请求的原始配置对象
 * @returns {Promise} 返回重试请求的 Promise
 *
 * @example
 * // 该函数通常由响应拦截器自动调用，无需手动调用
 * // 当 API 返回 401 状态时自动触发令牌刷新流程
 */
export const handleTokenRefresh = async (config) => {
  return new Promise((resolve) => {
    /**
     * 重试请求函数
     * @description 使用最新的令牌重新发送原始请求
     */
    const retryRequest = () => {
      var latestToken = getApeToken()
      config.headers.Authorization = `${latestToken.tokenType} ${latestToken.accessToken}`
      resolve(service(config))
    }

    // 将重试函数加入队列
    failedQueue.push(retryRequest)

    // 如果没有正在进行的刷新操作，则开始刷新流程
    if (!isRefreshing) {
      isRefreshing = true
      var oldToken = getApeToken()
      const nowTime = Date.now()
      const refreshTokenExpires = oldToken.refreshTokenExpires

      // 检查刷新令牌是否已过期
      if (nowTime >= refreshTokenExpires) {
        ElNotification({
          title: '提示',
          message: '您的会话已过期，请重新登录',
          type: 'info'
        })
        clearToken()
        router.push('/login')
        return
      }
      // 调用刷新令牌 API
      refreshToken({ token: oldToken.accessToken })
        .then((res) => {
          // 刷新成功：保存新令牌并重试所有失败的请求
          setApeToken(res.data)
          failedQueue.forEach((callback) => callback())
          failedQueue.length = 0 // 清空重试队列
        })
        .catch(async () => {
          // 刷新失败：清除令牌并重定向到登录页
          ElNotification({
            title: '提示',
            message: '您的会话已过期，请重新登录',
            type: 'info'
          })
          await clearToken()
          router.push('/login')
        })
        .finally(() => {
          // 无论成功失败都重置刷新状态
          isRefreshing = false
        })
    }
  })
}
