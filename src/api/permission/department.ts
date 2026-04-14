import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Department,
  DepartmentQueryParams,
  DepartmentPageResponse
} from './types/department.types'

// 重新导出类型供页面使用
export type { Department, DepartmentQueryParams, DepartmentPageResponse }

/**
 * 分页查询部门列表
 * @param {DepartmentQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<DepartmentPageResponse>>} 返回部门列表的Promise对象
 */
export const get = (
  params: DepartmentQueryParams
): Promise<AxiosResponse<DepartmentPageResponse>> => {
  return request({
    url: '/dept/query',
    method: 'get',
    params
  })
}

/**
 * 创建新部门
 * @param {Partial<Department>} data - 部门信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Department>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dept/create',
    method: 'post',
    data
  })
}

/**
 * 删除部门
 * @param {Array<number>} ids - 要删除的部门ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/dept/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑部门信息
 * @param {Partial<Department>} data - 部门信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (
  data: Partial<Department>
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/dept/edit',
    method: 'put',
    data
  })
}

/**
 * 导出部门数据
 * @param {DepartmentQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: DepartmentQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/dept/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取部门树结构
 * @returns {Promise<AxiosResponse<Department[]>>} 返回部门树的Promise对象
 */
export const getDeptTree = (): Promise<AxiosResponse<Department[]>> => {
  return request({
    url: '/dept/queryTree',
    method: 'get'
  })
}
