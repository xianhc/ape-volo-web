import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Dictionary,
  DictionaryQueryParams,
  DictionaryPageResponse
} from './types/dictionary.types'

/**
 * 分页查询字典列表
 * @param {DictionaryQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<DictionaryPageResponse>>} 返回字典列表的Promise对象
 */
export const get = (
  params: DictionaryQueryParams
): Promise<AxiosResponse<DictionaryPageResponse>> => {
  return request({
    url: '/dict/query',
    method: 'get',
    params
  })
}

/**
 * 创建新字典
 * @param {Partial<Dictionary>} data - 字典信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Dictionary>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dict/create',
    method: 'post',
    data
  })
}

/**
 * 删除字典
 * @param {Array<number>} ids - 要删除的字典ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dict/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑字典信息
 * @param {Partial<Dictionary>} data - 字典信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<Dictionary>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/dict/edit',
    method: 'put',
    data
  })
}

/**
 * 导出字典数据
 * @param {DictionaryQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: DictionaryQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/dict/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取单个字典信息
 * @param {DictionaryQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<Dictionary>>} 返回字典详情的Promise对象
 */
export const single = (
  params: DictionaryQueryParams
): Promise<AxiosResponse<Dictionary>> => {
  return request({
    url: '/dict/single',
    method: 'get',
    params
  })
}

/**
 * 获取所有字典列表
 * @returns {Promise<AxiosResponse<Dictionary[]>>} 返回所有字典的Promise对象
 */
export const getDicts = (): Promise<AxiosResponse<Dictionary[]>> => {
  return request({
    url: '/dict/all',
    method: 'get'
  })
}
