import request from '@/utils/request'

/**
 * 分页查询任务日志列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回任务日志列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/taskLog/query',
    method: 'get',
    params
  })
}

/**
 * 导出任务日志数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/taskLog/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
