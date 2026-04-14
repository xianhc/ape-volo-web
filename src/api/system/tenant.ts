import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Tenant,
  TenantQueryParams,
  TenantPageResponse
} from './types/tenant.types'

// 重新导出类型供页面使用
export type { Tenant, TenantQueryParams, TenantPageResponse }

/**
 * 分页查询租户列表
 * @param {TenantQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<TenantPageResponse>>} 返回租户列表的Promise对象
 */
export const get = (
  params: TenantQueryParams
): Promise<AxiosResponse<TenantPageResponse>> => {
  return request({
    url: '/tenant/query',
    method: 'get',
    params
  })
}

/**
 * 创建新租户
 * @param {Partial<Tenant>} data - 租户信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Tenant>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/tenant/create',
    method: 'post',
    data
  })
}

/**
 * 删除租户
 * @param {Array<number>} ids - 要删除的租户ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/tenant/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑租户信息
 * @param {Partial<Tenant>} data - 租户信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<Tenant>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/tenant/edit',
    method: 'put',
    data
  })
}

/**
 * 导出租户数据
 * @param {TenantQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: TenantQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/tenant/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取所有租户列表
 * @returns {Promise<AxiosResponse<Tenant[]>>} 返回所有租户的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<Tenant[]>> => {
  return request({
    url: '/tenant/queryAll',
    method: 'get'
  })
}
