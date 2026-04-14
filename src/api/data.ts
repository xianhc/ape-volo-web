import request from '@/utils/request'
import qs from 'qs'
import type { AxiosResponse } from 'axios'

/**
 * 查询参数接口
 */
export interface QueryParams {
  [key: string]: any
}

/**
 * 初始化数据请求
 * @param {string} url - 请求URL
 * @param {QueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<any>>} 返回数据的Promise对象
 */
export function initData(
  url: string,
  params: QueryParams
): Promise<AxiosResponse<any>> {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

/**
 * 下载文件数据
 * @param {string} url - 下载URL
 * @param {QueryParams} params - 下载参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export function download(
  url: string,
  params: QueryParams
): Promise<AxiosResponse<Blob>> {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
