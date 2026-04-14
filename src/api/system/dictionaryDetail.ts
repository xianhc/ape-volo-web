import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  DictionaryDetail,
  DictionaryDetailQueryParams,
  DictionaryDetailPageResponse
} from './types/dictionaryDetail.types'

/**
 * 分页查询字典详情列表
 * @param {DictionaryDetailQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<DictionaryDetailPageResponse>>} 返回字典详情列表的Promise对象
 */
export const get = (
  params: DictionaryDetailQueryParams
): Promise<AxiosResponse<DictionaryDetailPageResponse>> => {
  return request({
    url: '/dictDetail/query',
    method: 'get',
    params
  })
}

/**
 * 创建新字典详情
 * @param {Partial<DictionaryDetail>} data - 字典详情信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<DictionaryDetail>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dictDetail/create',
    method: 'post',
    data
  })
}

/**
 * 删除字典详情
 * @param {Array<number>} ids - 要删除的字典详情ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dictDetail/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑字典详情信息
 * @param {Partial<DictionaryDetail>} data - 字典详情信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<DictionaryDetail>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/dictDetail/edit',
    method: 'put',
    data
  })
}
