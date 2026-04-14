import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/api/types/base'
import type {
  User,
  UserQueryParams,
  UserPageResponse,
  UserRoleParams,
  UserJobParams,
  UserCenterData,
  PasswordParams,
  EmailParams
} from './types/user.types'

/**
 * 分页查询用户列表
 * @param {UserQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<UserPageResponse>>} 返回用户列表的Promise对象
 */
export const get = (
  params: UserQueryParams
): Promise<AxiosResponse<UserPageResponse>> => {
  if (Array.isArray(params.departmentIdArray)) {
    params.departmentIdArray = params.departmentIdArray.join(',')
  }
  return request({
    url: '/user/query',
    method: 'get',
    params
  })
}

/**
 * 创建新用户
 * @param {Partial<User>} data - 用户信息
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回创建结果的Promise对象
 */
export const add = (
  data: Partial<User>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {Array<number>} ids - 要删除的用户ID数组
 * @returns {Promise<AxiosResponse<ApiResponse>>} 返回删除结果的Promise对象
 */
export const del = (
  ids: Array<number>
): Promise<AxiosResponse<ApiResponse>> => {
  return request({
    url: '/user/delete',
    method: 'delete',
    data: { IdArray: ids }
  })
}

/**
 * 编辑用户信息
 * @param {Partial<User>} data - 用户信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const edit = (data: Partial<User>): Promise<AxiosResponse<void>> => {
  return request({
    url: '/user/edit',
    method: 'put',
    data
  })
}

/**
 * 导出用户数据
 * @param {UserQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: UserQueryParams
): Promise<AxiosResponse<Blob>> => {
  if (Array.isArray(params.departmentIdArray)) {
    params.departmentIdArray = params.departmentIdArray.join(',')
  }
  return request({
    url: '/user/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 编辑用户角色
 * @param {UserRoleParams} data - 用户角色信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const editUserRole = (
  data: UserRoleParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/user/editRole',
    method: 'put',
    data
  })
}

/**
 * 编辑用户岗位
 * @param {UserJobParams} data - 用户岗位信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export const editUserJob = (
  data: UserJobParams
): Promise<AxiosResponse<void>> => {
  return request({
    url: '/user/editJob',
    method: 'put',
    data
  })
}

/**
 * 编辑用户个人中心信息
 * @param {UserCenterData} data - 用户个人信息
 * @returns {Promise<AxiosResponse<void>>} 返回编辑结果的Promise对象
 */
export function editUserCenter(
  data: UserCenterData
): Promise<AxiosResponse<void>> {
  return request({
    url: '/user/update/center',
    method: 'put',
    data
  })
}

/**
 * 修改用户密码
 * @param {PasswordParams} user - 密码信息
 * @returns {Promise<AxiosResponse<void>>} 返回修改结果的Promise对象
 */
export function editUserPass(
  user: PasswordParams
): Promise<AxiosResponse<void>> {
  const data = {
    oldPassword: encrypt(user.oldPass),
    newPassword: encrypt(user.newPass),
    confirmPassword: encrypt(user.confirmPass)
  }
  return request({
    url: '/user/update/password',
    method: 'put',
    data
  })
}

/**
 * 修改用户界面偏好配置
 * @param {string} preferencesConfig - 用户界面偏好配置JSON字符串
 * @returns {Promise<AxiosResponse<void>>} 返回修改结果的Promise对象
 */
export function editPreferencesConfig(
  preferencesConfig: string
): Promise<AxiosResponse<void>> {
  return request({
    url: '/user/update/preferencesConfig',
    method: 'put',
    donNotShowLoading: true,
    data: { preferencesConfig }
  })
}

/**
 * 修改用户邮箱
 * @param {EmailParams} form - 邮箱信息
 * @returns {Promise<AxiosResponse<void>>} 返回修改结果的Promise对象
 */
export function editUserEmail(form: EmailParams): Promise<AxiosResponse<void>> {
  const data = {
    password: encrypt(form.pass),
    email: form.email,
    code: form.code
  }
  return request({
    url: '/user/update/Email',
    method: 'put',
    data
  })
}
