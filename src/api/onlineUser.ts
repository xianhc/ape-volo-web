import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'

/**
 * 在线用户接口
 */
export interface OnlineUser {
  id: string | number
  username: string
  nickname?: string
  ip?: string
  address?: string
  browser?: string
  loginTime?: string
  [key: string]: any
}

/**
 * 在线用户列表响应接口
 */
export interface OnlineUserListResponse {
  content: OnlineUser[]
  totalElements?: number
}

/**
 * 下载参数接口
 */
export interface DownloadParams {
  [key: string]: any
}

/**
 * 获取在线用户列表
 * @returns {Promise<AxiosResponse<OnlineUserListResponse>>} 在线用户列表
 */
export const get = (): Promise<AxiosResponse<OnlineUserListResponse>> => {
  return request({
    url: '/online/query',
    method: 'get'
  })
}

/**
 * 踢出在线用户
 * @param {Array<number>} ids 用户ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 请求结果
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/online/out',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 下载在线用户列表
 * @param {DownloadParams} params 查询参数
 * @returns {Promise<AxiosResponse<Blob>>} 请求结果
 */
export const download = (
  params: DownloadParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/online/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
