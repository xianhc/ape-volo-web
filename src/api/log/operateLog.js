import request from '@/utils/request'

/**
 * 分页查询操作日志列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回操作日志列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/operateLog/query',
    method: 'get',
    params
  })
}

/**
 * 获取当前用户操作日志
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回当前用户操作日志的Promise对象
 */
export const getCurrent = (params) => {
  return request({
    url: '/operateLog/current',
    method: 'get',
    params
  })
}

/**
 * 获取访问趋势统计数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回访问趋势数据的Promise对象
 */
export const getVisitTrend = (params) => {
  return request({
    url: '/operateLog/visitTrend',
    method: 'get',
    params
  })
}
