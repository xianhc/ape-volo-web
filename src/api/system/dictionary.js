import request from '@/utils/request'

/**
 * 分页查询字典列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回字典列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/dict/query',
    method: 'get',
    params
  })
}

/**
 * 创建新字典
 * @param {Object} data - 字典信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/dict/create',
    method: 'post',
    data
  })
}

/**
 * 删除字典
 * @param {Array<number>} ids - 要删除的字典ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/dict/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑字典信息
 * @param {Object} data - 字典信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/dict/edit',
    method: 'put',
    data
  })
}

/**
 * 导出字典数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/dict/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取单个字典信息
 * @param {Object} params - 查询参数
 * @param {number} params.id - 字典ID
 * @returns {Promise} 返回字典详情的Promise对象
 */
export const single = (params) => {
  return request({
    url: '/dict/single',
    method: 'get',
    params
  })
}

/**
 * 获取所有字典列表
 * @returns {Promise} 返回所有字典的Promise对象
 */
export const getDicts = () => {
  return request({
    url: '/dict/all',
    method: 'get'
  })
}
