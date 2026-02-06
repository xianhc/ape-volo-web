import request from '@/utils/request'

/**
 * 分页查询异常日志列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回异常日志列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/exceptionLog/query',
    method: 'get',
    params
  })
}
