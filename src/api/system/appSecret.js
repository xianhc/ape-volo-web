import request from '@/utils/request'

/**
 * 分页查询应用密钥列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回应用密钥列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/appSecret/query',
    method: 'get',
    params
  })
}

/**
 * 创建新应用密钥
 * @param {Object} data - 应用密钥信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/appSecret/create',
    method: 'post',
    data
  })
}

/**
 * 删除应用密钥
 * @param {Array<number>} ids - 要删除的应用密钥ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/appSecret/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑应用密钥信息
 * @param {Object} data - 应用密钥信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/appSecret/edit',
    method: 'put',
    data
  })
}

/**
 * 导出应用密钥数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/appSecret/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
