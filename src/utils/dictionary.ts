import { useDictionaryStore } from '@/pinia/modules/dictionary'

/**
 * 字典项接口
 * @interface DictItem
 * @property {any} [key: string] - 动态属性
 */
export interface DictItem {
  [key: string]: any
}

/**
 * 字典选项接口（用于下拉框等组件）
 * @interface DictOption
 * @example
 * const option: DictOption = { value: '1', label: '启用' }
 */
export interface DictOption {
  /** 选项值，用于表单绑定和数据提交 */
  value: string | number
  /** 选项标签，用于界面显示 */
  label: string
  /** 其他扩展属性 */
  [key: string]: any
}

/**
 * 获取字典数据
 * @function getDict
 * @description 从字典 store 中获取指定名称的字典数据
 *
 * @param {string} name - 字典名称
 * @returns {Promise<DictOption[]>} 字典选项数组
 *
 * @example
 * const statusDict = await getDict('user_status')
 * console.log(statusDict) // [{ value: '1', label: '启用' }, { value: '0', label: '禁用' }]
 */
export const getDict = async (name: string): Promise<DictOption[]> => {
  const dictionaryStore = useDictionaryStore()
  await dictionaryStore.getDictionary(name)
  return (dictionaryStore.dictionaryMap[name] || []) as DictOption[]
}

/**
 * 显示字典的值
 * @function showDictLabel
 * @description 根据字典代码获取对应的显示标签
 *
 * @param {DictOption[] | null | undefined} dict - 字典数组
 * @param {string | number} code - 字典代码
 * @param {string} [keyCode='value'] - 字典项中作为键的字段名
 * @param {string} [valueCode='label'] - 字典项中作为值的字段名
 * @returns {string} 对应的标签值，如果找不到则返回空字符串
 *
 * @example
 * const dict = [
 *   { value: '1', label: '启用' },
 *   { value: '0', label: '禁用' }
 * ]
 * showDictLabel(dict, '1') // '启用'
 * showDictLabel(dict, '0') // '禁用'
 * showDictLabel(dict, '2') // ''
 * showDictLabel(dict, '1', 'code', 'name') // 使用自定义字段名
 */
export const showDictLabel = (
  dict: DictOption[] | null | undefined,
  code: string | number,
  keyCode: string = 'value',
  valueCode: string = 'label'
): string => {
  if (!dict) {
    return ''
  }
  const dictMap: Record<string | number, any> = {}
  dict.forEach((item) => {
    if (Reflect.has(item, keyCode) && Reflect.has(item, valueCode)) {
      dictMap[item[keyCode]] = item[valueCode]
    }
  })
  return Reflect.has(dictMap, code) ? dictMap[code] : ''
}
