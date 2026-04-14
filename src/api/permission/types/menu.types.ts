import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 菜单实体接口
 */
export interface Menu extends BaseEntity {
  /** 菜单标题 */
  title: string
  /** 菜单类型 */
  type?: number
  /** 权限标识 */
  permission?: string
  /** 路由路径 */
  path?: string
  /** 组件路径 */
  component?: string
  /** 父级ID */
  pid?: number | string
  /** 图标 */
  icon?: string
  /** 排序 */
  sort?: number
  /** 是否缓存 */
  cache?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 组件名称 */
  componentName?: string
  /** 子菜单 */
  children?: Menu[]
}

/**
 * 菜单查询参数接口
 */
export interface MenuQueryParams extends BaseQueryParams {
  /** 菜单标题 */
  title?: string
  /** 菜单类型 */
  type?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否启用 */
  enabled?: boolean
  /** 父级ID */
  parentId?: number | string
}

/**
 * 菜单分页响应接口
 */
export type MenuPageResponse = BasePageResponse<Menu>
