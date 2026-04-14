import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Timing,
  TimingQueryParams,
  TimingPageResponse
} from './types/timing.types'

// 重新导出类型供页面使用
export type { Timing, TimingQueryParams, TimingPageResponse }

/**
 * 分页查询定时任务列表
 * @param {TimingQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<TimingPageResponse>>} 返回定时任务列表的Promise对象
 */
export const get = (
  params: TimingQueryParams
): Promise<AxiosResponse<TimingPageResponse>> => {
  return request({
    url: '/timing/query',
    method: 'get',
    params
  })
}

/**
 * 获取所有定时任务列表
 * @returns {Promise<AxiosResponse<Timing[]>>} 返回所有定时任务的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<Timing[]>> => {
  return request({
    url: '/timing/queryAll',
    method: 'get'
  })
}

/**
 * 创建新的定时任务
 * @param {Partial<Timing>} data - 定时任务信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export function add(
  data: Partial<Timing>
): Promise<AxiosResponse<ApiResponse>> {
  return request({
    url: '/timing/create',
    method: 'post',
    data
  })
}

/**
 * 删除定时任务
 * @param {Array<number>} ids - 要删除的任务ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export function del(ids: Array<number>): Promise<AxiosResponse<ApiResponse>> {
  return request({
    url: '/timing/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑定时任务信息
 * @param {Partial<Timing>} data - 定时任务信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export function edit(data: Partial<Timing>): Promise<AxiosResponse<void>> {
  return request({
    url: '/timing/edit',
    method: 'put',
    data
  })
}

/**
 * 导出定时任务数据
 * @param {TimingQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: TimingQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/timing/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 立即执行定时任务
 * @param {number | string} id - 任务ID
 * @returns {Promise<AxiosResponse<void>>} 返回执行结果的Promise对象
 */
export function execution(id: number | string): Promise<AxiosResponse<void>> {
  return request({
    url: '/timing/execute?id=' + id,
    method: 'put'
  })
}

/**
 * 暂停定时任务
 * @param {number | string} id - 任务ID
 * @returns {Promise<AxiosResponse<void>>} 返回暂停结果的Promise对象
 */
export function pause(id: number | string): Promise<AxiosResponse<void>> {
  return request({
    url: '/timing/pause?id=' + id,
    method: 'put'
  })
}

/**
 * 恢复定时任务
 * @param {number | string} id - 任务ID
 * @returns {Promise<AxiosResponse<void>>} 返回恢复结果的Promise对象
 */
export function resume(id: number | string): Promise<AxiosResponse<void>> {
  return request({
    url: '/timing/resume?id=' + id,
    method: 'put'
  })
}
