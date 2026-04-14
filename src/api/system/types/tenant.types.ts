import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 租户实体接口
 */
export interface Tenant extends BaseEntity {
  /** 租户ID */
  tenantId?: number | string
  /** 租户名称 */
  name: string
  /** 租户邮箱 */
  email?: string
  /** 租户电话 */
  phone?: string
  /** 联系人 */
  linkman?: string
  /** 是否启用 */
  enabled?: boolean
  /** 备注 */
  remark?: string
}

/**
 * 租户查询参数接口
 */
export interface TenantQueryParams extends BaseQueryParams {
  /** 租户名称 */
  name?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * 租户分页响应接口
 */
export type TenantPageResponse = BasePageResponse<Tenant>
