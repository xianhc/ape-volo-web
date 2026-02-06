import request from '@/utils/request'
import qs from 'qs'

/**
 * 初始化数据请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回数据的Promise对象
 */
export function initData(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

/**
 * 下载文件数据
 * @param {string} url - 下载URL
 * @param {Object} params - 下载参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
