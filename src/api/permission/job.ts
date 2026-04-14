import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { Job, JobQueryParams, JobPageResponse } from './types/job.types'
import type { ApiResponse } from '@/api/types/base'

// 重新导出类型供页面使用
export type { Job, JobQueryParams, JobPageResponse }

/**
 * 分页查询岗位列表
 * @param {JobQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<JobPageResponse>>} 返回岗位列表的Promise对象
 */
export const get = (
  params: JobQueryParams
): Promise<AxiosResponse<JobPageResponse>> => {
  return request({
    url: '/job/query',
    method: 'get',
    params
  })
}

/**
 * 获取所有岗位列表（不分页）
 * @returns {Promise<AxiosResponse<Job[]>>} 返回所有岗位的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<Job[]>> => {
  return request({
    url: '/job/queryAll',
    method: 'get'
  })
}

/**
 * 创建新岗位
 * @param {Partial<Job>} data - 岗位信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Job>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/job/create',
    method: 'post',
    data
  })
}

/**
 * 删除岗位
 * @param {Array<number>} ids - 要删除的岗位ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/job/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑岗位信息
 * @param {Partial<Job>} data - 岗位信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<Job>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/job/edit',
    method: 'put',
    data
  })
}

/**
 * 导出岗位数据
 * @param {JobQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: JobQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/job/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
