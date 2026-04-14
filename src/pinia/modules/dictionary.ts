import { single } from '@/api/system/dictionary'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

/**
 * 字典项接口
 */
export interface DictionaryItem {
  label: string
  value: string
}

/**
 * 字典映射类型
 */
export type DictionaryMap = Record<string, DictionaryItem[]>

/**
 * 字典 Store 状态接口
 */
export interface DictionaryState {
  dictionaryMap: Ref<DictionaryMap>
}

/**
 * 字典数据状态管理 Store
 * @description 管理系统字典数据的缓存和获取
 * @returns {Object} 字典状态和相关方法
 */
export const useDictionaryStore = defineStore('dictionary', () => {
  // 字典数据映射表
  const dictionaryMap = ref<DictionaryMap>({})

  /**
   * 设置字典数据到映射表
   * @param {DictionaryMap} dictionaryRes - 字典数据对象
   * @returns {void}
   */
  const setDictionaryMap = (dictionaryRes: DictionaryMap): void => {
    dictionaryMap.value = { ...dictionaryMap.value, ...dictionaryRes }
  }

  /**
   * 获取指定名称的字典数据
   * @param {string} name - 字典名称
   * @returns {Promise<DictionaryItem[]>} 返回字典项数组的Promise
   * @description 优先从缓存获取，缓存不存在则从API获取并缓存
   */
  const getDictionary = async (name: string): Promise<DictionaryItem[]> => {
    // 检查缓存中是否已存在该字典数据
    if (dictionaryMap.value[name] && dictionaryMap.value[name].length) {
      return dictionaryMap.value[name]
    } else {
      // 从API获取字典数据
      const res = await single({ name })
      const dictionaryRes: DictionaryMap = {}
      const dict: DictionaryItem[] = []
      // 处理字典详情数据
      res.data.dictDetails &&
        res.data.dictDetails.forEach((item: any) => {
          dict.push({
            label: item.label,
            value: item.value
          })
        })
      // 将数据加入缓存
      dictionaryRes[res.data.name] = dict
      setDictionaryMap(dictionaryRes)
      return dictionaryMap.value[name]
    }
  }

  return {
    dictionaryMap,
    setDictionaryMap,
    getDictionary
  }
})
