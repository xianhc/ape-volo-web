/**
 * 颜色转换为十六进制 RGB 数组
 * @function colorToHex
 * @description 将十六进制颜色字符串转换为 RGB 数组
 *
 * @param {string} u - 十六进制颜色字符串（如 '#FF0000'）
 * @returns {number[]} RGB 数组 [r, g, b]
 */
const colorToHex = (u: string): number[] => {
  let e = u.replace('#', '').match(/../g)
  if (!e) return [0, 0, 0]
  const result: number[] = []
  for (let t = 0; t < 3; t++) {
    result[t] = parseInt(e[t], 16)
  }
  return result
}

/**
 * RGB 值转换为十六进制颜色字符串
 * @function hexToColor
 * @description 将 RGB 三个数值转换为十六进制颜色字符串
 *
 * @param {number} u - 红色值 (0-255)
 * @param {number} e - 绿色值 (0-255)
 * @param {number} t - 蓝色值 (0-255)
 * @returns {string} 十六进制颜色字符串（如 '#FF0000'）
 */
const hexToColor = (u: number, e: number, t: number): string => {
  let a = [u.toString(16), e.toString(16), t.toString(16)]
  for (let n = 0; n < 3; n++) {
    if (a[n].length === 1) {
      a[n] = `0${a[n]}`
    }
  }
  return `#${a.join('')}`
}

/**
 * 生成深色变体颜色（暗模式）
 * @function generateAllColors
 * @description 将颜色与深色目标颜色混合，生成暗色调
 *
 * @param {string} u - 基础颜色（十六进制）
 * @param {number} e - 混合比例 (0-1)
 * @returns {string} 混合后的颜色（十六进制）
 */
const generateAllColors = (u: string, e: number): string => {
  let t = colorToHex(u)
  const target = [10, 10, 30]
  for (let a = 0; a < 3; a++) {
    t[a] = Math.floor(t[a] * (1 - e) + target[a] * e)
  }
  return hexToColor(t[0], t[1], t[2])
}

/**
 * 生成浅色变体颜色（亮模式）
 * @function generateAllLightColors
 * @description 将颜色与浅色目标颜色混合，生成亮色调
 *
 * @param {string} u - 基础颜色（十六进制）
 * @param {number} e - 混合比例 (0-1)
 * @returns {string} 混合后的颜色（十六进制）
 */
const generateAllLightColors = (u: string, e: number): string => {
  let t = colorToHex(u)
  const target = [240, 248, 255] // RGB for blue white color
  for (let a = 0; a < 3; a++) {
    t[a] = Math.floor(t[a] * (1 - e) + target[a] * e)
  }
  return hexToColor(t[0], t[1], t[2])
}

/**
 * 为颜色添加透明度
 * @function addOpacityToColor
 * @description 将十六进制颜色转换为带透明度的 RGBA 颜色
 *
 * @param {string} u - 十六进制颜色字符串
 * @param {number} opacity - 透明度 (0-1)
 * @returns {string} RGBA 颜色字符串
 *
 * @example
 * addOpacityToColor('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
 */
function addOpacityToColor(u: string, opacity: number): string {
  let t = colorToHex(u)
  return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${opacity})`
}

/**
 * 设置主题色
 * @function setBodyPrimaryColor
 * @description 设置全局主题色和相关的颜色变量
 *
 * 功能：
 * - 设置主色调
 * - 根据深色/浅色模式生成色阶
 * - 设置菜单悬停颜色
 *
 * @param {string} primaryColor - 主题色（十六进制）
 * @param {'light' | 'dark'} darkMode - 主题模式
 *
 * @example
 * setBodyPrimaryColor('#409EFF', 'light')
 * setBodyPrimaryColor('#409EFF', 'dark')
 */
export const setBodyPrimaryColor = (
  primaryColor: string,
  darkMode: 'light' | 'dark'
): void => {
  let fmtColorFunc = generateAllColors
  if (darkMode === 'light') {
    fmtColorFunc = generateAllLightColors
  }

  document.documentElement.style.setProperty('--el-color-primary', primaryColor)
  document.documentElement.style.setProperty(
    '--el-color-primary-bg',
    addOpacityToColor(primaryColor, 0.4)
  )
  for (let times = 1; times <= 2; times++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-dark-${times}`,
      fmtColorFunc(primaryColor, times / 10)
    )
  }
  for (let times = 1; times <= 10; times++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${times}`,
      fmtColorFunc(primaryColor, times / 10)
    )
  }
  document.documentElement.style.setProperty(
    `--el-menu-hover-bg-color`,
    addOpacityToColor(primaryColor, 0.2)
  )
}

/**
 * 设置圆角大小
 * @function setCornerSize
 * @description 设置全局圆角大小的 CSS 变量
 *
 * @param {number} cornerSize - 圆角大小（单位：rem）
 *
 * @example
 * setCornerSize(0.5) // 设置圆角为 0.5rem
 * setCornerSize(1) // 设置圆角为 1rem
 */
export const setCornerSize = (cornerSize: number): void => {
  document.documentElement.style.setProperty(
    '--ape-volo-radius',
    cornerSize + 'rem'
  )
}
