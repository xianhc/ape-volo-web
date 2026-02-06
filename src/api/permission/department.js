import request from '@/utils/request'

/**
 * 分页查询部门列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回部门列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/dept/query',
    method: 'get',
    params
  })
}

/**
 * 创建新部门
 * @param {Object} data - 部门信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/dept/create',
    method: 'post',
    data
  })
}

/**
 * 删除部门
 * @param {Array<number>} ids - 要删除的部门ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/dept/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑部门信息
 * @param {Object} data - 部门信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/dept/edit',
    method: 'put',
    data
  })
}

/**
 * 导出部门数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/dept/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取部门树结构
 * @returns {Promise} 返回部门树的Promise对象
 */
export const getDeptTree = () => {
  return request({
    url: '/dept/queryTree',
    method: 'get'
  })
}
