import request from '@/utils/request'

/**
 * 获取登录验证码
 * @returns {Promise} 返回验证码信息的Promise对象
 */
export const getLoginCaptcha = () => {
  return request({
    url: '/auth/captcha',
    method: 'get'
  })
}

/**
 * 获取重置密码邮箱验证码
 * @param {Object} data - 邮箱信息
 * @returns {Promise} 返回发送结果的Promise对象
 */
export const getResetEmailCode = (data) => {
  return request({
    url: 'auth/resetEmailCode',
    method: 'post',
    data
  })
}
