import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'

/**
 * 邮件队列接口
 */
export interface EmailQueued {
  id: number | string
  from?: string
  to?: string
  cc?: string
  bcc?: string
  subject?: string
  body?: string
  sentTries?: number
  sentTime?: string
  emailAccountId?: number | string
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
 * 分页查询邮件队列列表
 * @param {QueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<PageResponse<EmailQueued>>>} 返回邮件队列列表的Promise对象
 */
export const get = (
  params: QueryParams
): Promise<AxiosResponse<PageResponse<EmailQueued>>> => {
  return request({
    url: '/queued/email/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮件队列
 * @param {Partial<EmailQueued>} data - 邮件队列信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<EmailQueued>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/queued/email/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮件队列
 * @param {Array<number>} ids - 要删除的邮件队列ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/queued/email/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑邮件队列信息
 * @param {Partial<EmailQueued>} data - 邮件队列信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<EmailQueued>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/queued/email/edit',
    method: 'put',
    data
  })
}
