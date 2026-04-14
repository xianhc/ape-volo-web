import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Setting,
  SettingQueryParams,
  SettingPageResponse
} from './types/setting.types'

/**
 * 分页查询系统配置列表
 * @param {SettingQueryParams} params - 查询配置
 * @returns {Promise<AxiosResponse<SettingPageResponse>>} 返回系统配置列表的Promise对象
 */
export const get = (
  params: SettingQueryParams
): Promise<AxiosResponse<SettingPageResponse>> => {
  return request({
    url: '/setting/query',
    method: 'get',
    params
  })
}

/**
 * 创建新的系统配置
 * @param {Partial<Setting>} data - 系统配置信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Setting>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/setting/create',
    method: 'post',
    data
  })
}

/**
 * 删除系统配置
 * @param {Array<number>} ids - 要删除的配置ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/setting/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑系统配置信息
 * @param {Partial<Setting>} data - 系统配置信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<Setting>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/setting/edit',
    method: 'put',
    data
  })
}

/**
 * 导出系统配置数据
 * @param {SettingQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: SettingQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/setting/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
