import request from '@/utils/request'

/**
 * 获取在线用户列表
 * @returns {Promise} 在线用户列表
 */
export const get = () => {
  return request({
    url: '/online/query',
    method: 'get'
  })
}

/**
 * 踢出在线用户
 * @param {Array} ids 用户ID数组
 * @returns {Promise} 请求结果
 */
export const del = (ids) => {
  return request({
    url: '/online/out',
    method: 'delete',
    data: ids
  })
}

/**
 * 下载在线用户列表
 * @param {Object} params 查询参数
 * @returns {Promise} 请求结果
 */
export const download = (params) => {
  return request({
    url: '/online/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
