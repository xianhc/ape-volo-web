/**
 * 将字符串转换为布尔值
 * @function strToBool
 * @description 将字符串形式的布尔值转换为真正的布尔类型
 *
 * 转换规则：
 * - 字符串 'true'（忽略大小写）→ true
 * - 其他所有值 → false
 * - null 或 undefined → false
 *
 * @param {string | null | undefined} inputStr - 输入的字符串
 * @returns {boolean} 转换后的布尔值
 *
 * @example
 * strToBool('true') // true
 * strToBool('True') // true
 * strToBool('TRUE') // true
 * strToBool('false') // false
 * strToBool('any other string') // false
 * strToBool(null) // false
 * strToBool(undefined) // false
 */
export const strToBool = (inputStr: string | null | undefined): boolean => {
  if (inputStr !== null && inputStr !== undefined) {
    return String(inputStr).toLowerCase() === 'true'
  } else {
    return false
  }
}

/**
 * 格式化布尔值为中文显示
 * @function formatBoolean
 * @description 将布尔值转换为中文"是"/"否"的显示格式
 *
 * 转换规则：
 * - true → '是'
 * - false → '否'
 * - null 或 undefined → ''
 *
 * @param {boolean | null | undefined} bool - 要格式化的布尔值
 * @returns {string} 格式化后的中文字符串
 *
 * @example
 * formatBoolean(true) // '是'
 * formatBoolean(false) // '否'
 * formatBoolean(null) // ''
 * formatBoolean(undefined) // ''
 */
export const formatBoolean = (bool: boolean | null | undefined): string => {
  if (bool !== null && bool !== undefined) {
    return bool ? '是' : '否'
  } else {
    return ''
  }
}
