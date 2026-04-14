import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type {
  ExceptionLogQueryParams,
  ExceptionLogPageResponse
} from './types/exceptionLog.types'

/**
 * 分页查询异常日志列表
 * @param {ExceptionLogQueryParams} params - 查询参数
 * @returns {Promise<AxiosResponse<ExceptionLogPageResponse>>} 返回异常日志列表的Promise对象
 */
export const get = (
  params: ExceptionLogQueryParams
): Promise<AxiosResponse<ExceptionLogPageResponse>> => {
  return request({
    url: '/exceptionLog/query',
    method: 'get',
    params
  })
}
