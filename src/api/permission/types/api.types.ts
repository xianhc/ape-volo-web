import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * API接口实体
 */
export interface ApiItem extends BaseEntity {
  /** 请求URL */
  url?: string
  /** 接口描述 */
  description?: string
  /** 请求方法 */
  method?: string
  /** 接口分组 */
  group?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * API查询参数接口
 */
export interface ApiQueryParams extends BaseQueryParams {
  /** 请求URL */
  url?: string
  /** 接口描述 */
  description?: string
  /** 请求方法 */
  method?: string
  /** 接口分组 */
  group?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * API分页响应接口
 */
export type ApiPageResponse = BasePageResponse<ApiItem>

/**
 * API分组信息接口
 */
export interface ApiGroup {
  /** 分组名称 */
  group: string
  /** 数量 */
  count?: number
}

/**
 * API刷新参数接口
 */
export interface ApiRefreshParams {
  /** 是否强制刷新 */
  force?: boolean
}
