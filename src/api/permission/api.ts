import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  ApiItem,
  ApiQueryParams,
  ApiPageResponse,
  ApiGroup,
  ApiRefreshParams
} from './types/api.types'

// 重新导出类型供页面使用
export type {
  ApiItem,
  ApiQueryParams,
  ApiPageResponse,
  ApiGroup,
  ApiRefreshParams
}

/**
 * 分页查询API列表
 * @param {ApiQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<ApiPageResponse>>} 返回API列表的Promise对象
 */
export const get = (
  params: ApiQueryParams
): Promise<AxiosResponse<ApiPageResponse>> => {
  return request({
    url: '/apis/query',
    method: 'get',
    params
  })
}

/**
 * 创建新API
 * @param {Partial<ApiItem>} data - API信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<ApiItem>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/apis/create',
    method: 'post',
    data
  })
}

/**
 * 删除API
 * @param {Array<number>} ids - 要删除的API ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/apis/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑API信息
 * @param {Partial<ApiItem>} data - API信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<ApiItem>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/apis/edit',
    method: 'put',
    data
  })
}

/**
 * 导出API数据
 * @param {ApiQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: ApiQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/apis/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取API分组信息
 * @returns {Promise<AxiosResponse<string[]>>} 返回API分组的Promise对象
 */
export const group = (): Promise<AxiosResponse<string[]>> => {
  return request({
    url: '/apis/group',
    method: 'GET'
  })
}

/**
 * 刷新API数据
 * @param {ApiRefreshParams} data - 刷新参数
 * @returns {Promise<AxiosResponse<void>>} 返回刷新结果的Promise对象
 */
export const refresh = (
  data: ApiRefreshParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/apis/refresh',
    method: 'POST',
    data
  })
}

/**
 * 获取所有API列表（不分页）
 * @returns {Promise<AxiosResponse<ApiItem[]>>} 返回所有API的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<ApiItem[]>> => {
  return request({
    url: '/apis/queryAll',
    method: 'get'
  })
}
