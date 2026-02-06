import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

/**
 * 分页查询用户列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回用户列表的Promise对象
 */
export const get = (params) => {
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
 * @param {Object} data - 用户信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @param {Array<number>} ids - 要删除的用户ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/user/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/user/edit',
    method: 'put',
    data
  })
}

/**
 * 导出用户数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
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
 * @param {Object} data - 用户角色信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const editUserRole = (data) => {
  return request({
    url: '/user/editRole',
    method: 'put',
    data
  })
}

/**
 * 编辑用户岗位
 * @param {Object} data - 用户岗位信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const editUserJob = (data) => {
  return request({
    url: '/user/editJob',
    method: 'put',
    data
  })
}

/**
 * 编辑用户个人中心信息
 * @param {Object} data - 用户个人信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export function editUserCenter(data) {
  return request({
    url: '/user/update/center',
    method: 'put',
    data
  })
}

/**
 * 修改用户密码
 * @param {Object} user - 密码信息
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function editUserPass(user) {
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
 * 修改用户邮箱
 * @param {Object} form - 邮箱信息
 * @returns {Promise} 返回修改结果的Promise对象
 */
export function editUserEmail(form) {
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
