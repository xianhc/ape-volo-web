import request from '@/utils/request'

/**
 * 分页查询岗位列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @param {string} [params.name] - 岗位名称（可选）
 * @param {boolean} [params.enabled] - 是否启用（可选）
 * @returns {Promise} 返回岗位列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/job/query',
    method: 'get',
    params
  })
}

/**
 * 获取所有岗位列表（不分页）
 * @returns {Promise} 返回所有岗位的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/job/queryAll',
    method: 'get'
  })
}

/**
 * 创建新岗位
 * @param {Object} data - 岗位信息
 * @param {string} data.name - 岗位名称
 * @param {number} data.sort - 排序
 * @param {boolean} data.enabled - 是否启用
 * @param {string} [data.description] - 岗位描述（可选）
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/job/create',
    method: 'post',
    data
  })
}

/**
 * 删除岗位
 * @param {Array<number>} ids - 要删除的岗位ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/job/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑岗位信息
 * @param {Object} data - 岗位信息
 * @param {number} data.id - 岗位ID
 * @param {string} data.name - 岗位名称
 * @param {number} data.sort - 排序
 * @param {boolean} data.enabled - 是否启用
 * @param {string} [data.description] - 岗位描述（可选）
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/job/edit',
    method: 'put',
    data
  })
}

/**
 * 导出岗位数据
 * @param {Object} params - 导出参数
 * @param {string} [params.name] - 岗位名称（可选）
 * @param {boolean} [params.enabled] - 是否启用（可选）
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/job/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
