/**
 * 格式化日期对象
 * @function formatDate
 * @description 将日期对象格式化为指定格式的字符串
 *
 * 支持的格式标记：
 * - yyyy: 四位年份
 * - yy: 两位年份
 * - MM: 两位月份（01-12）
 * - M: 一位或两位月份（1-12）
 * - dd: 两位日期（01-31）
 * - d: 一位或两位日期（1-31）
 * - hh: 两位小时（00-23）
 * - h: 一位或两位小时（0-23）
 * - mm: 两位分钟（00-59）
 * - m: 一位或两位分钟（0-59）
 * - ss: 两位秒（00-59）
 * - s: 一位或两位秒（0-59）
 * - q: 季度（1-4）
 * - S: 毫秒（0-999）
 *
 * @param {Date | string | number | null | undefined} date - 要格式化的日期，可以是 Date 对象、时间戳或日期字符串
 * @param {string} [fmt='yyyy-MM-dd hh:mm:ss'] - 日期格式模板
 * @returns {string | null} 格式化后的日期字符串，如果日期为空则返回 null
 *
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd') // '2026-02-10'
 * formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss') // '2026/02/10 14:30:00'
 * formatDate(new Date(), 'yyyy年MM月dd日') // '2026年02月10日'
 * formatDate(null) // null
 */
function formatDate(
  date: Date | string | number | null | undefined,
  fmt: string = 'yyyy-MM-dd hh:mm:ss'
): string | null {
  if (!date) return null
  if (!(date instanceof Date)) date = new Date(date)

  const o: Record<string, number> = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }

  // 年份处理
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }

  // 其它格式处理
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? String(o[k])
          : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * 格式化时间
 * @function formatTime
 * @description formatDate 的别名函数，用于格式化时间
 *
 * @param {Date | string | number | null | undefined} time - 要格式化的时间
 * @param {string} [pattern] - 时间格式模板
 * @returns {string | null} 格式化后的时间字符串，如果时间为空则返回 null
 *
 * @example
 * formatTime(new Date(), 'hh:mm:ss') // '14:30:00'
 * formatTime(Date.now(), 'yyyy-MM-dd') // '2026-02-10'
 */
export function formatTime(
  time: Date | string | number | null | undefined,
  pattern?: string
): string | null {
  if (!time) return null
  return formatDate(time, pattern)
}
