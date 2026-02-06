import { useDictionaryStore } from '@/pinia/modules/dictionary'

// 获取字典数据
export const getDict = async (name) => {
  const dictionaryStore = useDictionaryStore()
  await dictionaryStore.getDictionary(name)
  return dictionaryStore.dictionaryMap[name]
}

// 显示字典的值
export const showDictLabel = (
  dict,
  code,
  keyCode = 'value',
  valueCode = 'label'
) => {
  if (!dict) {
    return ''
  }
  const dictMap = {}
  dict.forEach((item) => {
    if (Reflect.has(item, keyCode) && Reflect.has(item, valueCode)) {
      dictMap[item[keyCode]] = item[valueCode]
    }
  })
  return Reflect.has(dictMap, code) ? dictMap[code] : ''
}
