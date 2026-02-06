import request from '@/utils/request'

/**
 * 分页查询API列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回API列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/apis/query',
    method: 'get',
    params
  })
}

/**
 * 创建新API
 * @param {Object} data - API信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/apis/create',
    method: 'post',
    data
  })
}

/**
 * 删除API
 * @param {Array<number>} ids - 要删除的API ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/apis/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑API信息
 * @param {Object} data - API信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/apis/edit',
    method: 'put',
    data
  })
}

/**
 * 导出API数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/apis/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取API分组信息
 * @returns {Promise} 返回API分组的Promise对象
 */
export const group = () => {
  return request({
    url: '/apis/group',
    method: 'GET'
  })
}

/**
 * 刷新API数据
 * @param {Object} data - 刷新参数
 * @returns {Promise} 返回刷新结果的Promise对象
 */
export const refresh = (data) => {
  return request({
    url: '/apis/refresh',
    method: 'POST',
    data
  })
}

/**
 * 获取所有API列表（不分页）
 * @returns {Promise} 返回所有API的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/apis/queryAll',
    method: 'get'
  })
}
