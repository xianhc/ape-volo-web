import type { Ref, ComputedRef } from 'vue'
import { reactive, ref, toRefs, watch, provide, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { AxiosResponse } from 'axios'
import { downloadFile } from '@/utils/downloadFile'
import type { ApiResponse } from '@/api/types/base'

/**
 * CRUD方法接口
 * @template T - 实体类型
 * @template Q - 查询参数类型，默认为 any
 * @template R - 列表响应类型，默认为 any
 */
export interface CrudMethod<T = any, Q = any, R = any> {
  /**
   * 列表查询方法
   */
  list: (params: Q) => Promise<AxiosResponse<R>>
  /**
   * 新增方法
   */
  add: (data: T) => Promise<AxiosResponse<ApiResponse>>
  /**
   * 编辑方法
   */
  edit: (data: T) => Promise<AxiosResponse<void>>
  /**
   * 删除方法
   */
  del: (ids: Array<number>) => Promise<AxiosResponse<ApiResponse>>
  /**
   * 下载方法
   */
  download: (params: Q) => Promise<any>
}

/**
 * CRUD配置选项
 * @template T - 实体类型
 * @template Q - 查询参数类型
 * @template R - 列表响应类型
 */
export interface CrudOptions<T = any, Q = any, R = any> {
  /**
   * CRUD方法对象
   */
  crudMethod: CrudMethod<T, Q, R>
  /**
   * 默认表单数据生成函数
   */
  defaultForm: () => T
  /**
   * 搜索条件对象
   */
  searchInfo?: Ref<Record<string, any>>
  /**
   * 分页大小选项数组
   */
  pageSizeOptions?: number[]
  /**
   * 默认排序字段
   */
  sortProp?: string
  /**
   * 默认排序方式
   */
  sortOrder?: 'ascending' | 'descending' | ''
  /**
   * 是否在初始化时刷新数据
   */
  refreshOnInit?: boolean
}

/**
 * CRUD状态接口
 */
export interface CrudState<T = any> {
  /**
   * 数据列表
   */
  data: T[]
  /**
   * 表单数据
   */
  form: T
  /**
   * 表单标题
   */
  formTitle: string
  /**
   * 当前页码
   */
  pageIndex: number
  /**
   * 每页大小
   */
  pageSize: number
  /**
   * 总记录数
   */
  total: number
  /**
   * 加载状态
   */
  loading: boolean
  /**
   * 对话框可见性
   */
  dialogVisible: boolean
  /**
   * 是否为编辑模式
   */
  isEdit: boolean
  /**
   * 多选项
   */
  multipleSelection: T[]
  /**
   * 排序字段
   */
  sortProp: string
  /**
   * 排序方式
   */
  sortOrder: 'ascending' | 'descending' | ''
  /**
   * 搜索切换
   */
  searchToggle: boolean
}

/**
 * 分页配置接口
 */
export interface PaginationConfig {
  'current-page': number
  'page-size': number
  total: number
  pageSizes: number[]
  layout: string
  onCurrentChange: (page: number) => Promise<void>
  onSizeChange: (size: number) => Promise<void>
}

/**
 * CRUD实例接口
 */
export interface CrudInstance<T = any> {
  data: Ref<T[]>
  form: Ref<T>
  formTitle: Ref<string>
  pageIndex: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  loading: Ref<boolean>
  dialogVisible: Ref<boolean>
  isEdit: Ref<boolean>
  multipleSelection: Ref<T[]>
  sortProp: Ref<string>
  sortOrder: Ref<'ascending' | 'descending' | ''>
  searchToggle: Ref<boolean>
  query: Ref<Record<string, any>>
  pagination: ComputedRef<PaginationConfig>
  refresh: () => Promise<void>
  toAdd: (extra?: Partial<T>) => void
  toEdit: (row: T) => void
  save: (formData?: T) => Promise<void>
  doDelete: (row: T & { id: number }) => Promise<void>
  doBatchDelete: () => Promise<void>
  doExport: () => Promise<void>
  onPageChange: (page: number) => Promise<void>
  onSizeChange: (size: number) => Promise<void>
  onSelectionChange: (val: T[]) => void
  resetQuery: () => Promise<void>
  onSortChange: (sortInfo: {
    prop: string
    order: 'ascending' | 'descending' | null
  }) => Promise<void>
  resetForm: (data?: T) => void
  closeDialog: () => void
  getFormTitle: () => string
  validateAndSave: (formRef?: FormInstance, customData?: T) => Promise<void>
}

/**
 * CRUD操作的Vue3组合式API Hook
 * @template T - 数据类型
 * @template Q - 查询参数类型
 * @template R - 列表响应类型
 * @param {CrudOptions<T, Q, R>} options - 配置选项
 * @returns {CrudInstance<T>} CRUD实例对象
 */
export function useCrud<T = any, Q = any, R = any>(
  options: CrudOptions<T, Q, R>
): CrudInstance<T> {
  const {
    crudMethod,
    defaultForm,
    searchInfo,
    pageSizeOptions = [1, 10, 20, 30, 50, 100],
    sortProp = 'id',
    sortOrder = 'descending',
    refreshOnInit = true
  } = options

  // 主数据与状态
  const crudState = reactive<CrudState<T>>({
    data: [],
    form: defaultForm(),
    formTitle: '',
    pageIndex: 1,
    pageSize: pageSizeOptions[1],
    total: 0,
    loading: false,
    dialogVisible: false,
    isEdit: false,
    multipleSelection: [],
    sortProp: sortProp,
    sortOrder: sortOrder,
    searchToggle: true
  })

  const query = searchInfo || ref<Record<string, any>>({})

  /**
   * 获取查询参数
   * @param {boolean} isExport - 是否为导出查询
   * @returns {Record<string, any>} 查询参数对象
   */
  function getQueryParams(isExport: boolean = false): Record<string, any> {
    if (isExport) {
      return {
        ...query.value
      }
    }
    let sort: Record<string, any> = {}
    if (crudState.sortProp && crudState.sortOrder) {
      sort = {
        sortField: crudState.sortProp,
        orderByType: crudState.sortOrder === 'ascending' ? 0 : 1
      }
    }
    return {
      pageIndex: crudState.pageIndex,
      pageSize: crudState.pageSize,
      ...query.value,
      ...sort
    }
  }

  /**
   * 刷新数据列表
   * @returns {Promise<void>} 无返回值的Promise
   */
  const refresh = async (): Promise<void> => {
    crudState.loading = true
    try {
      const params = getQueryParams() as Q
      const res = await crudMethod.list(params)
      crudState.data = (res.data as any).content || res.data || []
      crudState.total =
        (res.data as any).totalElements || (res as any).total || 0
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 打开新增对话框
   * @param {Partial<T>} extra - 额外的表单数据
   * @returns {void}
   */
  const toAdd = (extra: Partial<T> = {}): void => {
    crudState.form = { ...defaultForm(), ...extra } as any
    crudState.formTitle = '新增'
    crudState.isEdit = false
    crudState.dialogVisible = true
  }

  /**
   * 打开编辑对话框
   * @param {T} row - 要编辑的行数据
   * @returns {void}
   */
  const toEdit = (row: T): void => {
    crudState.form = { ...row } as any
    crudState.formTitle = '编辑'
    crudState.isEdit = true
    crudState.dialogVisible = true
  }

  /**
   * 重置表单数据
   * @param {T} data - 重置的数据，如果不传则使用默认表单数据
   * @returns {void}
   */
  const resetForm = (data?: T): void => {
    crudState.form = data ? ({ ...data } as any) : defaultForm()
  }

  /**
   * 关闭对话框
   * @returns {void}
   */
  const closeDialog = (): void => {
    crudState.isEdit = false
    crudState.dialogVisible = false
    resetForm()
  }

  /**
   * 获取表单标题
   * @returns {string} 表单标题
   */
  const getFormTitle = (): string => {
    return `${crudState.isEdit ? '编辑' : '新增'}`
  }

  /**
   * 保存数据（新增或编辑）
   * @param {T} formData - 表单数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const save = async (formData?: T): Promise<void> => {
    const submitData = formData || crudState.form

    // 过滤掉 Vue 内部属性和事件属性
    const cleanData = Object.keys(submitData as Record<string, any>).reduce(
      (acc, key) => {
        // 过滤掉以下划线开头的Vue内部属性和事件相关属性
        if (!key.startsWith('_') && key !== 'isTrusted') {
          acc[key] = (submitData as any)[key]
        }
        return acc
      },
      {} as any
    )

    crudState.loading = true
    try {
      if (crudState.isEdit) {
        await crudMethod.edit(cleanData as T)
        ElMessage({
          type: 'success',
          message: '编辑成功',
          showClose: true
        })
      } else {
        const res = await crudMethod.add(cleanData as T)
        ElMessage({
          type: 'success',
          message: res.data.message || '新增成功',
          showClose: true
        })
      }
      crudState.dialogVisible = false
      crudState.isEdit = false
      await refresh()
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 验证表单并保存
   * @param {FormInstance} formRef - 表单引用
   * @param {T} customData - 自定义数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const validateAndSave = async (
    formRef?: FormInstance,
    customData?: T
  ): Promise<void> => {
    if (!formRef) {
      console.warn('表单引用不存在')
      return
    }
    try {
      const valid = await formRef.validate()
      if (valid) {
        await save(customData)
      }
    } catch (error) {
      console.log('表单验证失败', error)
    }
  }

  /**
   * 删除单条记录
   * @param {T & { id: number }} row - 要删除的行数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const doDelete = async (row: T & { id: number }): Promise<void> => {
    crudState.loading = true
    try {
      const res = await crudMethod.del([row.id])
      ElMessage({
        type: 'success',
        message: res.data.message || '删除成功'
      })
      await refresh()
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 批量删除记录
   * @returns {Promise<void>} 无返回值的Promise
   */
  const doBatchDelete = async (): Promise<void> => {
    if (!crudState.multipleSelection.length) {
      ElMessage.warning('请先选择要删除的数据')
      return
    }
    crudState.loading = true
    try {
      ElMessageBox.confirm(
        `确认删除选中的${crudState.multipleSelection.length}条数据?`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const ids = crudState.multipleSelection.map((row: any) => row.id)
          const res = await crudMethod.del(ids)
          ElMessage({
            type: 'success',
            message: res.data.message || '删除成功'
          })
          await refresh()
        })
        .catch((err) => {
          if (err === 'cancel' || err === 'close') return
          console.error(err)
        })
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 导出数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const doExport = async (): Promise<void> => {
    crudState.loading = true
    try {
      const res = await crudMethod.download(getQueryParams(true) as Q)
      // 1. 获取文件名
      let fileName = 'download.xlsx'
      const disposition = res.headers['content-disposition']
      if (disposition) {
        // 优先 filename*= ，其次 filename=
        let match = disposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
        if (match) {
          // 解码 RFC 5987
          fileName = decodeURIComponent(match[1].replace(/['"]/g, ''))
        } else {
          match = disposition.match(/filename="?([^"]+)"?/)
          if (match) {
            fileName = decodeURIComponent(escape(match[1])) // 兼容中文
          }
        }
      }

      downloadFile(res.data, fileName)
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 分页页码改变事件
   * @param {number} page - 新的页码
   * @returns {Promise<void>} 无返回值的Promise
   */
  const onPageChange = async (page: number): Promise<void> => {
    crudState.pageIndex = page
    await refresh()
  }

  /**
   * 分页大小改变事件
   * @param {number} size - 新的分页大小
   * @returns {Promise<void>} 无返回值的Promise
   */
  const onSizeChange = async (size: number): Promise<void> => {
    crudState.pageSize = size
    crudState.pageIndex = 1
    await refresh()
  }

  /**
   * 表格选择改变事件
   * @param {T[]} val - 选中的行数据数组
   * @returns {void}
   */
  const onSelectionChange = (val: T[]): void => {
    crudState.multipleSelection = val as any
  }

  /**
   * 重置查询条件
   * @returns {Promise<void>} 无返回值的Promise
   */
  const resetQuery = async (): Promise<void> => {
    if (searchInfo) {
      Object.keys(searchInfo.value).forEach((key) => {
        searchInfo.value[key] = null
      })
    } else {
      Object.keys(query.value).forEach((key) => {
        query.value[key] = null
      })
    }
    crudState.sortProp = ''
    crudState.sortOrder = ''
    crudState.pageIndex = 1
    await refresh()
  }

  /**
   * 表格排序改变事件
   * @param {Object} sortInfo - 排序信息
   * @param {string} sortInfo.prop - 排序字段
   * @param {'ascending' | 'descending' | null} sortInfo.order - 排序方式
   * @returns {Promise<void>} 无返回值的Promise
   */
  const onSortChange = async ({
    prop,
    order
  }: {
    prop: string
    order: 'ascending' | 'descending' | null
  }): Promise<void> => {
    crudState.sortProp = prop
    crudState.sortOrder = order || ''
    crudState.pageIndex = 1
    await refresh()
  }

  let timer: ReturnType<typeof setTimeout> | null = null
  if (searchInfo) {
    watch(
      searchInfo,
      () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(async () => {
          crudState.pageIndex = 1
          await refresh()
        }, 500) // 防抖处理
      },
      { deep: true }
    )
  }

  /**
   * 分页配置对象
   */
  const pagination = computed<PaginationConfig>(() => ({
    'current-page': crudState.pageIndex,
    'page-size': crudState.pageSize,
    total: crudState.total,
    pageSizes: pageSizeOptions,
    layout: 'total, sizes, prev, pager, next, jumper',
    onCurrentChange: onPageChange,
    onSizeChange: onSizeChange
  }))

  const crudInstance: CrudInstance<T> = {
    ...(toRefs(crudState) as any),
    query,
    pagination,
    refresh,
    toAdd,
    toEdit,
    save,
    doDelete,
    doBatchDelete,
    doExport,
    onPageChange,
    onSizeChange,
    onSelectionChange,
    resetQuery,
    onSortChange,
    resetForm,
    closeDialog,
    getFormTitle,
    validateAndSave
  }

  provide('crud', crudInstance)
  if (refreshOnInit) {
    void refresh()
  }
  return crudInstance
}
