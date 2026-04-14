import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type {
  Storage,
  StorageQueryParams,
  StoragePageResponse
} from './types/storage.types'
import type { ApiResponse } from '@/api/types/base'

/**
 * 分页查询存储文件列表
 * @param {StorageQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<StoragePageResponse>>} 返回存储文件列表的Promise对象
 */
export const get = (
  params: StorageQueryParams
): Promise<AxiosResponse<StoragePageResponse>> => {
  return request({
    url: '/storage/query',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 * @param {FormData} data - 包含文件的FormData对象
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回上传结果的Promise对象
 */
export const add = (data: FormData): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/storage/upload',
    method: 'post',
    data
  })
}

/**
 * 删除存储文件
 * @param {Array<number>} ids - 要删除的文件ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/storage/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑存储文件信息
 * @param {Partial<Storage>} data - 文件信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<Storage>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/storage/edit',
    method: 'put',
    data
  })
}

/**
 * 导出存储文件数据
 * @param {StorageQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: StorageQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/storage/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
