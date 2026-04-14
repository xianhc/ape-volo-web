import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'

/**
 * 邮件模板接口
 */
export interface EmailTemplate {
  id: number | string
  name: string
  bccEmailAddresses?: string
  subject?: string
  body?: string
  isActive?: boolean
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
 * 分页查询邮件模板列表
 * @param {QueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<PageResponse<EmailTemplate>>>} 返回邮件模板列表的Promise对象
 */
export const get = (
  params: QueryParams
): Promise<AxiosResponse<PageResponse<EmailTemplate>>> => {
  return request({
    url: '/email/template/query',
    method: 'get',
    params
  })
}

/**
 * 创建新邮件模板
 * @param {Partial<EmailTemplate>} data - 邮件模板信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<EmailTemplate>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/email/template/create',
    method: 'post',
    data
  })
}

/**
 * 删除邮件模板
 * @param {Array<number>} ids - 要删除的邮件模板ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/email/template/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑邮件模板信息
 * @param {Partial<EmailTemplate>} data - 邮件模板信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<EmailTemplate>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/email/template/edit',
    method: 'put',
    data
  })
}
