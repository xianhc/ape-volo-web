import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 部门实体接口
 */
export interface Department extends BaseEntity {
  /** 部门名称 */
  name: string
  /** 父级ID */
  pid?: number | string
  /** 是否启用 */
  enabled?: boolean
  /** 排序 */
  sort?: number
  /** 子部门数量 */
  subCount?: number
  /** 子部门 */
  children?: Department[]
}

/**
 * 部门查询参数接口
 */
export interface DepartmentQueryParams extends BaseQueryParams {
  /** 部门名称 */
  name?: string
  /** 是否启用 */
  enabled?: boolean
  /** 父级ID */
  parentId?: number | string
}

/**
 * 部门分页响应接口
 */
export type DepartmentPageResponse = BasePageResponse<Department>
