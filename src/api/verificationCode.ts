import request from '@/utils/request'
import type { AxiosResponse } from 'axios'

/**
 * 验证码响应接口
 */
export interface CaptchaResponse {
  id: string
  img: string
  [key: string]: any
}

/**
 * 重置密码邮箱参数接口
 */
export interface ResetEmailCodeParams {
  email: string
  [key: string]: any
}

/**
 * 获取登录验证码
 * @returns {Promise<AxiosResponse<CaptchaResponse>>} 返回验证码信息的Promise对象
 */
export const getLoginCaptcha = (): Promise<AxiosResponse<CaptchaResponse>> => {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}

/**
 * 获取重置密码邮箱验证码
 * @param {ResetEmailCodeParams} data - 邮箱信息
 * @returns {Promise<AxiosResponse<void>>} 返回发送结果的Promise对象
 */
export const getResetEmailCode = (
  data: ResetEmailCodeParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/auth/resetEmailCode',
    method: 'post',
    data
  })
}
