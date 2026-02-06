import request from '@/utils/request'

/**
 * 分页查询邮件模板列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回邮件模板列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/email/template/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮件模板
 * @param {Object} data - 邮件模板信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/email/template/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮件模板
 * @param {Array<number>} ids - 要删除的邮件模板ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/email/template/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑邮件模板信息
 * @param {Object} data - 邮件模板信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/email/template/edit',
    method: 'put',
    data
  })
}
