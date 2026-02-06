import request from '@/utils/request'

/**
 * 分页查询定时任务列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回定时任务列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/timing/query',
    method: 'get',
    params
  })
}

/**
 * 获取所有定时任务列表
 * @returns {Promise} 返回所有定时任务的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/timing/queryAll',
    method: 'get'
  })
}

/**
 * 创建新的定时任务
 * @param {Object} data - 定时任务信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export function add(data) {
  return request({
    url: '/timing/create',
    method: 'post',
    data
  })
}

/**
 * 删除定时任务
 * @param {Array<number>} ids - 要删除的任务ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export function del(ids) {
  return request({
    url: '/timing/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑定时任务信息
 * @param {Object} data - 定时任务信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export function edit(data) {
  return request({
    url: '/timing/edit',
    method: 'put',
    data
  })
}

/**
 * 导出定时任务数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/timing/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 立即执行定时任务
 * @param {number} id - 任务ID
 * @returns {Promise} 返回执行结果的Promise对象
 */
export function execution(id) {
  return request({
    url: '/timing/execute?id=' + id,
    method: 'put'
  })
}

/**
 * 暂停定时任务
 * @param {number} id - 任务ID
 * @returns {Promise} 返回暂停结果的Promise对象
 */
export function pause(id) {
  return request({
    url: '/timing/pause?id=' + id,
    method: 'put'
  })
}

/**
 * 恢复定时任务
 * @param {number} id - 任务ID
 * @returns {Promise} 返回恢复结果的Promise对象
 */
export function resume(id) {
  return request({
    url: '/timing/resume?id=' + id,
    method: 'put'
  })
}
