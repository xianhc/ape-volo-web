import request from '@/utils/request'

/**
 * 分页查询系统配置列表
 * @param {Object} params - 查询配置
 * @returns {Promise} 返回系统配置列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/setting/query',
    method: 'get',
    params
  })
}

/**
 * 创建新的系统配置
 * @param {Object} data - 系统配置信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/setting/create',
    method: 'post',
    data
  })
}

/**
 * 删除系统配置
 * @param {Array<number>} ids - 要删除的配置ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/setting/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑系统配置信息
 * @param {Object} data - 系统配置信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/setting/edit',
    method: 'put',
    data
  })
}

/**
 * 导出系统配置数据
 * @param {Object} params - 导出系统配置
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/setting/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
