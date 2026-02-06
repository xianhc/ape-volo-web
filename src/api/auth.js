import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} captcha - 验证码
 * @param {string} captchaId - 验证码ID
 * @returns {Promise} 返回登录结果的Promise对象
 */
export const login = (username, password, captcha, captchaId) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password: encrypt(password),
      captcha,
      captchaId
    }
  })
}

/**
 * 刷新访问令牌
 * @param {Object} data - 刷新令牌信息
 * @returns {Promise} 返回新令牌的Promise对象
 */
export const refreshToken = (data) => {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {Promise} 返回登出结果的Promise对象
 */
export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise} 返回用户信息的Promise对象
 */
export const getUserInfo = () => {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}
