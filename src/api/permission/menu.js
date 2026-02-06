import request from '@/utils/request'

/**
 * 构建用户菜单树
 * @returns {Promise} 返回用户菜单树的Promise对象
 */
export const build = () => {
  return request({
    url: '/menu/build',
    method: 'get'
  })
}

/**
 * 分页查询菜单列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回菜单列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/menu/query',
    method: 'get',
    params
  })
}

/**
 * 创建新菜单
 * @param {Object} data - 菜单信息
 * @returns {Promise} 返回创建结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/menu/create',
    method: 'post',
    data
  })
}

/**
 * 删除菜单
 * @param {Array<number>} ids - 要删除的菜单ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/menu/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑菜单信息
 * @param {Object} data - 菜单信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/menu/edit',
    method: 'put',
    data
  })
}

/**
 * 导出菜单数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/menu/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}

/**
 * 获取所有菜单列表（不分页）
 * @returns {Promise} 返回所有菜单的Promise对象
 */
export const getAll = () => {
  return request({
    url: '/menu/queryAll',
    method: 'get'
  })
}
