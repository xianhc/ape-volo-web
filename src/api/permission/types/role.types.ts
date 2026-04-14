import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 角色实体接口
 */
export interface Role extends BaseEntity {
  /** 角色名称 */
  name: string
  /** 角色编码 */
  code?: string
  /** 角色级别 */
  level?: number
  /** 角色描述 */
  description?: string
  /** 数据权限范围 */
  dataScope?: string
  /** 是否启用 */
  enabled?: boolean
  /** 菜单ID列表 */
  menuList?: Array<number | string>
  /** API ID列表 */
  apiList?: Array<number | string>
}

/**
 * 角色查询参数接口
 */
export interface RoleQueryParams extends BaseQueryParams {
  /** 角色名称 */
  name?: string
  /** 角色编码 */
  code?: string
  /** 是否启用 */
  enabled?: boolean
  /** 数据权限类型 */
  dataScopeType?: string
}

/**
 * 单个角色查询参数接口
 */
export interface RoleSingleParams extends BaseQueryParams {
  /** 角色ID */
  id: number
}

/**
 * 角色分页响应接口
 */
export type RolePageResponse = BasePageResponse<Role>

/**
 * 角色菜单权限参数接口
 */
export interface RoleMenuParams {
  /** 角色ID */
  id: number | string
  /** 菜单ID列表 */
  menuIdArray: Array<number | string>
}

/**
 * 角色API权限参数接口
 */
export interface RoleApiParams {
  /** 角色ID */
  id: number | string
  /** API ID列表 */
  apiIdArray: Array<number | string>
}
