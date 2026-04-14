import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type {
  TaskLogQueryParams,
  TaskLogPageResponse
} from './types/taskLog.types'

/**
 * 分页查询任务日志列表
 * @param {TaskLogQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<TaskLogPageResponse>>} 返回任务日志列表的Promise对象
 */
export const get = (
  params: TaskLogQueryParams
): Promise<AxiosResponse<TaskLogPageResponse>> => {
  return request({
    url: '/taskLog/query',
    method: 'get',
    params
  })
}

/**
 * 导出任务日志数据
 * @param {TaskLogQueryParams} params - 导出参数
 * @returns {Promise<AxiosResponse<Blob>>} 返回文件流的Promise对象
 */
export const download = (
  params: TaskLogQueryParams
): Promise<AxiosResponse<Blob>> => {
  return request({
    url: '/taskLog/download',
    method: 'get',
    responseType: 'blob',
    params
  })
}
