import request from '@/utils/request'

/**
 * 分页查询租户列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回租户列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/tenant/query',
    method: 'get',
    params
  })
}

/**
 * 创建新租户
 * @param {Object} data - 租户信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/tenant/create',
    method: 'post',
    data
  })
}

/**
 * 删除租户
 * @param {Array<number>} ids - 要删除的租户ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/tenant/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑租户信息
 * @param {Object} data - 租户信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/tenant/edit',
    method: 'put',
    data
  })
}

/**
 * 导出租户数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/tenant/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取所有租户列表
 * @returns {Promise} 返回所有租户的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/tenant/queryAll',
    method: 'get'
  })
}
