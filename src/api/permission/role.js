import request from '@/utils/request'

/**
 * 分页查询角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回角色列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/role/query',
    method: 'get',
    params
  })
}

/**
 * 创建新角色
 * @param {Object} data - 角色信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param {Array<number>} ids - 要删除的角色ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/role/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑角色信息
 * @param {Object} data - 角色信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/role/edit',
    method: 'put',
    data
  })
}

/**
 * 导出角色数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/role/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取单个角色信息
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回角色详情的Promise对象
 */
export const single = (params) => {
  return request({
    url: '/role/single',
    method: 'get',
    params
  })
}

/**
 * 编辑角色菜单权限
 * @param {Object} data - 角色菜单权限信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const editRoleMenu = (data) => {
  return request({
    url: '/role/editMenu',
    method: 'put',
    data
  })
}

/**
 * 编辑角色API权限
 * @param {Object} data - 角色API权限信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const editRoleApi = (data) => {
  return request({
    url: '/role/editApi',
    method: 'put',
    data
  })
}

/**
 * 获取所有角色列表（不分页）
 * @returns {Promise} 返回所有角色的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/role/queryAll',
    method: 'get'
  })
}

/**
 * 获取角色级别信息
 * @returns {Promise} 返回角色级别的Promise对象
 */
export const getLevel = () => {
  return request({
    url: '/role/level',
    method: 'get'
  })
}
