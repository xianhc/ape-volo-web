import request from '@/utils/request'

/**
 * 分页查询字典详情列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回字典详情列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/dictDetail/query',
    method: 'get',
    params
  })
}

/**
 * 创建新字典详情
 * @param {Object} data - 字典详情信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/dictDetail/create',
    method: 'post',
    data
  })
}

/**
 * 删除字典详情
 * @param {Array<number>} ids - 要删除的字典详情ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/dictDetail/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑字典详情信息
 * @param {Object} data - 字典详情信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/dictDetail/edit',
    method: 'put',
    data
  })
}
