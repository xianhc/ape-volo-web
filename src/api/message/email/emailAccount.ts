import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'

/**
 * 邮箱账户接口
 */
export interface EmailAccount {
  id: number | string
  email: string
  displayName?: string
  host?: string
  port?: number
  username?: string
  password?: string
  enableSsl?: boolean
  isDefault?: boolean
  createTime?: string
  updateTime?: string
  [key: string]: any
}

/**
 * 分页查询参数接口
 */
export interface QueryParams {
  page?: number
  size?: number
  sort?: string
  [key: string]: any
}

/**
 * 分页响应接口
 */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

/**
 * 分页查询邮箱账户列表
 * @param {QueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<PageResponse<EmailAccount>>>} 返回邮箱账户列表的Promise对象
 */
export const get = (
  params: QueryParams
): Promise<AxiosResponse<PageResponse<EmailAccount>>> => {
  return request({
    url: '/email/account/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮箱账户
 * @param {Partial<EmailAccount>} data - 邮箱账户信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<EmailAccount>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/email/account/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮箱账户
 * @param {Array<number>} ids - 要删除的邮箱账户ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/email/account/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑邮箱账户信息
 * @param {Partial<EmailAccount>} data - 邮箱账户信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<EmailAccount>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/email/account/edit',
    method: 'put',
    data
  })
}

/**
 * 导出邮箱账户数据
 * @param {QueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (params: QueryParams): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/email/account/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取所有邮箱账户列表（不分页）
 * @returns {Promise<AxiosResponse<EmailAccount[]>>} 返回所有邮箱账户的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<EmailAccount[]>> => {
  return request({
    url: '/email/account/queryAll',
    method: 'get'
  })
}
