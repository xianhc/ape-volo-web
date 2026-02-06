import { reactive, ref, toRefs, watch, provide, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downloadFile } from '@/utils/downloadFile'

/**
 * CRUD操作的Vue3组合式API Hook
 * @param {Object} options - 配置选项
 * @param {Object} options.crudMethod - CRUD方法对象，包含list、add、edit、del、download方法
 * @param {Function} options.defaultForm - 默认表单数据生成函数
 * @param {Object} options.searchInfo - 搜索条件对象
 * @param {Array<number>} options.pageSizeOptions - 分页大小选项数组
 * @param {string} options.sortProp - 默认排序字段
 * @param {string} options.sortOrder - 默认排序方式
 * @param {boolean} options.refreshOnInit - 是否在初始化时刷新数据
 * @returns {Object} CRUD实例对象
 */
export function useCrud({
  crudMethod,
  defaultForm,
  searchInfo,
  pageSizeOptions = [1, 10, 20, 30, 50, 100],
  sortProp = 'id',
  sortOrder = 'descending',
  refreshOnInit = true
}) {
  // 主数据与状态
  const crudState = reactive({
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

  const query = searchInfo || ref({})

  /**
   * 获取查询参数
   * @param {boolean} isExport - 是否为导出查询
   * @returns {Object} 查询参数对象
   */
  function getQueryParams(isExport = false) {
    if (isExport) {
      return {
        ...query.value
      }
    }
    let sort = {}
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
  const refresh = async () => {
    crudState.loading = true
    try {
      const params = getQueryParams()
      const res = await crudMethod.list(params)
      crudState.data = res.data.content || res.data || []
      crudState.total = res.data.totalElements || res.total || 0
    } finally {
      crudState.loading = false
    }
  }

  /**
   * 打开新增对话框
   * @param {Object} extra - 额外的表单数据
   * @returns {void}
   */
  const toAdd = (extra = {}) => {
    crudState.form = { ...defaultForm(), ...extra }
    crudState.formTitle = '新增'
    crudState.isEdit = false
    crudState.dialogVisible = true
  }

  /**
   * 打开编辑对话框
   * @param {Object} row - 要编辑的行数据
   * @returns {void}
   */
  const toEdit = (row) => {
    crudState.form = { ...row }
    crudState.formTitle = '编辑'
    crudState.isEdit = true
    crudState.dialogVisible = true
  }

  /**
   * 重置表单数据
   * @param {Object} data - 重置的数据，如果不传则使用默认表单数据
   * @returns {void}
   */
  const resetForm = (data) => {
    crudState.form = data ? { ...data } : defaultForm()
  }

  /**
   * 关闭对话框
   * @returns {void}
   */
  const closeDialog = () => {
    crudState.isEdit = false
    crudState.dialogVisible = false
    resetForm()
  }

  /**
   * 获取表单标题
   * @returns {string} 表单标题
   */
  const getFormTitle = () => {
    return `${crudState.isEdit ? '编辑' : '新增'}`
  }

  /**
   * 保存数据（新增或编辑）
   * @param {Object} formData - 表单数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const save = async (formData) => {
    const submitData = formData || crudState.form
    crudState.loading = true
    try {
      if (crudState.isEdit) {
        await crudMethod.edit(submitData)
        ElMessage({
          type: 'success',
          message: '编辑成功',
          showClose: true
        })
      } else {
        const res = await crudMethod.add(submitData)
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
   * @param {Object} formRef - 表单引用
   * @param {Object} customData - 自定义数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const validateAndSave = async (formRef, customData) => {
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
   * @param {Object} row - 要删除的行数据
   * @returns {Promise<void>} 无返回值的Promise
   */
  const doDelete = async (row) => {
    crudState.loading = true
    try {
      const res = await crudMethod.del({ IdArray: [row.id] })
      ElMessage({
        type: 'success',
        message: res.data.message
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
  const doBatchDelete = async () => {
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
          const res = await crudMethod.del({
            IdArray: crudState.multipleSelection.map((row) => row.id)
          })
          ElMessage({
            type: 'success',
            message: res.data.message
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
  const doExport = async () => {
    crudState.loading = true
    try {
      const res = await crudMethod.download(getQueryParams(true))
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
  const onPageChange = async (page) => {
    crudState.pageIndex = page
    await refresh()
  }
  /**
   * 分页大小改变事件
   * @param {number} size - 新的分页大小
   * @returns {Promise<void>} 无返回值的Promise
   */
  const onSizeChange = async (size) => {
    crudState.pageSize = size
    crudState.pageIndex = 1
    await refresh()
  }

  /**
   * 表格选择改变事件
   * @param {Array} val - 选中的行数据数组
   * @returns {void}
   */
  const onSelectionChange = (val) => {
    crudState.multipleSelection = val
  }

  /**
   * 重置查询条件
   * @returns {Promise<void>} 无返回值的Promise
   */
  const resetQuery = async () => {
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
   * @param {string} sortInfo.order - 排序方式
   * @returns {Promise<void>} 无返回值的Promise
   */
  const onSortChange = async ({ prop, order }) => {
    crudState.sortProp = prop
    crudState.sortOrder = order
    crudState.pageIndex = 1
    await refresh()
  }

  let timer = null
  if (searchInfo) {
    watch(
      searchInfo,
      () => {
        clearTimeout(timer)
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
  const pagination = computed(() => ({
    'current-page': crudState.pageIndex,
    'page-size': crudState.pageSize,
    total: crudState.total,
    pageSizes: pageSizeOptions,
    layout: 'total, sizes, prev, pager, next, jumper',
    onCurrentChange: onPageChange,
    onSizeChange: onSizeChange
  }))

  const crudInstance = {
    ...toRefs(crudState),
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
