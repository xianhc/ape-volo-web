import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  Role,
  RoleSingleParams,
  RoleQueryParams,
  RolePageResponse,
  RoleMenuParams,
  RoleApiParams
} from './types/role.types'

// 重新导出类型供页面使用
export type {
  Role,
  RoleSingleParams,
  RoleQueryParams,
  RolePageResponse,
  RoleMenuParams,
  RoleApiParams
}

/**
 * 分页查询角色列表
 * @param {RoleQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<RolePageResponse>>} 返回角色列表的Promise对象
 */
export const get = (
  params: RoleQueryParams
): Promise<AxiosResponse<RolePageResponse>> => {
  return request({
    url: '/role/query',
    method: 'get',
    params
  })
}

/**
 * 创建新角色
 * @param {Partial<Role>} data - 角色信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<Role>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param {Array<number>} ids - 要删除的角色ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/role/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑角色信息
 * @param {Partial<Role>} data - 角色信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<Role>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/role/edit',
    method: 'put',
    data
  })
}

/**
 * 导出角色数据
 * @param {RoleQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: RoleQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/role/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取单个角色信息
 * @param {RoleSingleParams} params - 查询参数
 * @returns {Promise<AxiosResponse<Role>>} 返回角色详情的Promise对象
 */
export const single = (
  params: RoleSingleParams
): Promise<AxiosResponse<Role>> => {
  return request({
    url: '/role/single',
    method: 'get',
    params
  })
}

/**
 * 编辑角色菜单权限
 * @param {RoleMenuParams} data - 角色菜单权限信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const editRoleMenu = (
  data: RoleMenuParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/role/editMenu',
    method: 'put',
    data
  })
}

/**
 * 编辑角色API权限
 * @param {RoleApiParams} data - 角色API权限信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const editRoleApi = (
  data: RoleApiParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/role/editApi',
    method: 'put',
    data
  })
}

/**
 * 获取所有角色列表（不分页）
 * @returns {Promise<AxiosResponse<Role[]>>} 返回所有角色的Promise对象
 */
export const getAll = (): Promise<AxiosResponse<Role[]>> => {
  return request({
    url: '/role/queryAll',
    method: 'get'
  })
}

/**
 * 获取角色级别信息
 * @returns {Promise<AxiosResponse<number>>} 返回角色级别的Promise对象
 */
export const getLevel = (): Promise<AxiosResponse<number>> => {
  return request({
    url: '/role/level',
    method: 'get'
  })
}
