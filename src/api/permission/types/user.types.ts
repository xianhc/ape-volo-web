import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 用户实体接口
 */
export interface User extends BaseEntity {
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname?: string
  /** 性别 */
  gender?: string
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 头像 */
  avatar?: string
  /** 是否启用 */
  enabled?: boolean
  /** 是否是管理员 */
  isAdmin?: boolean
  /** 部门信息 */
  department?: any
  /** 岗位列表 */
  jobs?: any[]
  /** 角色列表 */
  roles?: any[]
  /** 部门ID数组 */
  departmentIdArray?: Array<number | string> | string
}

/**
 * 用户查询参数接口
 */
export interface UserQueryParams extends BaseQueryParams {
  /** 用户名 */
  username?: string
  /** 昵称 */
  nickname?: string
  /** 性别 */
  gender?: string
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 是否启用 */
  enabled?: boolean
  /** 部门ID数组 */
  departmentIdArray?: Array<number | string> | string
  /** 租户ID */
  tenantId?: number | string
}

/**
 * 用户分页响应接口
 */
export type UserPageResponse = BasePageResponse<User>

/**
 * 用户角色参数接口
 */
export interface UserRoleParams {
  /** 用户ID */
  id: number | string
  /** 角色ID列表 */
  roleIdArray: Array<number | string>
}

/**
 * 用户岗位参数接口
 */
export interface UserJobParams {
  /** 用户ID */
  id: number | string
  /** 岗位ID列表 */
  jobIdArray: Array<number | string>
}

/**
 * 用户个人中心信息接口
 */
export interface UserCenterData {
  /** 用户信息 */
  user?: User
  /** 其他数据 */
  [key: string]: any
}

/**
 * 修改密码参数接口
 */
export interface PasswordParams {
  /** 旧密码 */
  oldPass: string
  /** 新密码 */
  newPass: string
  /** 确认密码 */
  confirmPass: string
}

/**
 * 修改邮箱参数接口
 */
export interface EmailParams {
  /** 密码 */
  pass: string
  /** 邮箱 */
  email: string
  /** 验证码 */
  code: string
}
