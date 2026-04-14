/**
 * 基础查询参数接口
 * 注意：分页参数（pageIndex, pageSize）和排序参数（sortField, orderByType）由 UseCrud 自动注入
 * 各模块需要的特定查询字段（如时间范围、关键字等）请在各自的 QueryParams 中定义
 */
export interface BaseQueryParams {
  // 空接口，作为所有查询参数的基类
}

/**
 * 基础分页响应接口
 */
export interface BasePageResponse<T> {
  /** 数据内容 */
  content: T[]
  /** 总记录数 */
  totalElements: number
  /** 总页数 */
  totalPages: number
}

/**
 * 基础实体接口
 */
export interface BaseEntity {
  /** 主键ID */
  id: number
  /** 创建人 */
  createBy?: string
  /** 创建时间 */
  createTime?: string
  /** 更新人 */
  updateBy?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 通用操作响应接口
 */
export interface ApiResponse<T = any> {
  /** HTTP状态码 */
  status: number
  /** 错误信息 */
  actionError: string | null
  /** 提示消息 */
  message: string
  /** 时间戳 */
  timestamp: string
  /** 请求路径 */
  path: string
  /** 响应数据 */
  data?: T
}
