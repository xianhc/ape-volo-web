import request from '@/utils/request'

/**
 * 分页查询邮件队列列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回邮件队列列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/queued/email/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮件队列
 * @param {Object} data - 邮件队列信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/queued/email/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮件队列
 * @param {Array<number>} ids - 要删除的邮件队列ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/queued/email/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑邮件队列信息
 * @param {Object} data - 邮件队列信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/queued/email/edit',
    method: 'put',
    data
  })
}
