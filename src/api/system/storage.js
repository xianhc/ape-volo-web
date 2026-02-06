import request from '@/utils/request'

/**
 * 分页查询存储文件列表
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回存储文件列表的Promise对象
 */
export const get = (params) => {
  return request({
    url: '/storage/query',
    method: 'get',
    params
  })
}

/**
 * 上传文件
 * @param {FormData} data - 包含文件的FormData对象
 * @param {File} data.file - 要上传的文件
 * @returns {Promise} 返回上传结果的Promise对象
 */
export const add = (data) => {
  return request({
    url: '/storage/upload',
    method: 'post',
    data
  })
}

/**
 * 删除存储文件
 * @param {Array<number>} ids - 要删除的文件ID数组
 * @returns {Promise} 返回删除结果的Promise对象
 */
export const del = (ids) => {
  return request({
    url: '/storage/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 编辑存储文件信息
 * @param {Object} data - 文件信息
 * @returns {Promise} 返回编辑结果的Promise对象
 */
export const edit = (data) => {
  return request({
    url: '/storage/edit',
    method: 'put',
    data
  })
}

/**
 * 导出存储文件数据
 * @param {Object} params - 导出参数
 * @returns {Promise} 返回文件流的Promise对象
 */
export const download = (params) => {
  return request({
    url: '/storage/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
