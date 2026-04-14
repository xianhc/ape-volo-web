import type {
  BaseQueryParams,
  BasePageResponse,
  BaseEntity
} from '../../types/base'

/**
 * 定时任务实体接口
 */
export interface Timing extends BaseEntity {
  /** 任务名称 */
  taskName: string
  /** 分组名称 */
  groupName?: string
  /** 程序集名称 */
  assemblyName?: string
  /** 类名 */
  className?: string
  /** Cron表达式 */
  cron?: string
  /** 运行次数 */
  runTimes?: number
  /** 开始时间 */
  beginTime?: string
  /** 结束时间 */
  endTime?: string
  /** 触发器类型 */
  triggerType?: number
  /** 间隔秒数 */
  intervalSecond?: number
  /** 是否启用 */
  isEnable?: boolean
  /** 备注 */
  remark?: string
}

/**
 * 定时任务查询参数接口
 */
export interface TimingQueryParams extends BaseQueryParams {
  /** 任务名称 */
  taskName?: string
  /** 分组名称 */
  groupName?: string
  /** 任务组（别名） */
  taskGroup?: string
  /** 任务描述 */
  description?: string
  /** 是否启用 */
  isEnable?: boolean
  /** 是否启用（别名） */
  enabled?: boolean
}

/**
 * 定时任务分页响应接口
 */
export type TimingPageResponse = BasePageResponse<Timing>
