import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'
import type { AxiosResponse } from 'axios'

/**
 * 登录请求参数接口
 */
export interface LoginParams {
  username: string
  password: string
  captcha: string
  captchaId: string
}

/**
 * 登录响应数据接口
 */
export interface LoginResponse {
  user: UserInfo
  token: {
    accessToken: string
    refreshToken: string
    tokenType: string
    expires: number
    refreshTokenExpires: number
  }
  roleCodes: string[]
  authCodes: string[]
}

/**
 * 刷新令牌请求参数接口
 */
export interface RefreshTokenParams {
  token: string
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number | string
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: any
}

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} captcha - 验证码
 * @param {string} captchaId - 验证码ID
 * @returns {Promise<AxiosResponse<LoginResponse>>} 返回登录结果的Promise对象
 */
export const login = (
  username: string,
  password: string,
  captcha: string,
  captchaId: string
): Promise<AxiosResponse<LoginResponse>> => {
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
 * @param {RefreshTokenParams} data - 刷新令牌信息
 * @returns {Promise<AxiosResponse<LoginResponse>>} 返回新令牌的Promise对象
 */
export const refreshToken = (
  data: RefreshTokenParams
): Promise<AxiosResponse<LoginResponse>> => {
  return request({
    url: '/auth/refreshToken',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {Promise<AxiosResponse<void>>} 返回登出结果的Promise对象
 */
export const logout = (): Promise<AxiosResponse<void>> => {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

/**
 * 获取当前用户信息
 * @returns {Promise<AxiosResponse<UserInfo>>} 返回用户信息的Promise对象
 */
export const getUserInfo = (): Promise<AxiosResponse<UserInfo>> => {
  return request({
    url: '/auth/info',
    method: 'get'
  })
}
