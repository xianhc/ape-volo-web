import request from '@/utils/request'

/**
 * 分页查询邮箱账户列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回邮箱账户列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/email/account/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮箱账户
 * @param {Object} data - 邮箱账户信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/email/account/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮箱账户
 * @param {Array<number>} ids - 要删除的邮箱账户ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/email/account/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑邮箱账户信息
 * @param {Object} data - 邮箱账户信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/email/account/edit',
    method: 'put',
    data
  })
}

/**
 * 导出邮箱账户数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/email/account/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取所有邮箱账户列表（不分页）
 * @returns {Promise} 返回所有邮箱账户的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/email/account/queryAll',
    method: 'get'
  })
}
