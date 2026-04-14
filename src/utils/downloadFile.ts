/**
 * 下载文件
 * @function downloadFile
 * @description 通过创建临时 a 标签下载文件
 *
 * @param {Blob | ArrayBuffer | string} obj - 文件内容（Blob、ArrayBuffer、字符串等）
 * @param {string} fileName - 下载的文件名
 *
 * @example
 * // 下载文本文件
 * downloadFile('Hello World', 'test.txt')
 *
 * // 下载 Blob 数据
 * const blob = new Blob([data], { type: 'application/pdf' })
 * downloadFile(blob, 'document.pdf')
 */
export const downloadFile = (
  obj: Blob | ArrayBuffer | string,
  fileName: string
): void => {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 根据 MIME 类型获取文件扩展名
 * @function getExtensionFromMimeType
 * @description 将 MIME 类型转换为对应的文件扩展名
 *
 * 支持的 MIME 类型：
 * - 图片：jpeg, png, gif, svg
 * - 音频：mp3, wav
 * - 视频：mp4, webm
 * - 文档：pdf, doc, docx, xls, xlsx, ppt, pptx
 * - 压缩包：zip
 *
 * @param {string} mimeType - MIME 类型
 * @returns {string} 对应的文件扩展名（包含点号），未知类型返回空字符串
 *
 * @example
 * getExtensionFromMimeType('image/jpeg') // '.jpg'
 * getExtensionFromMimeType('application/pdf') // '.pdf'
 * getExtensionFromMimeType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') // '.xlsx'
 * getExtensionFromMimeType('unknown/type') // ''
 */
export const getExtensionFromMimeType = (mimeType: string): string => {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/gif':
      return '.gif'
    case 'image/svg+xml':
      return '.svg'
    case 'audio/mpeg':
      return '.mp3'
    case 'audio/wav':
      return '.wav'
    case 'video/mp4':
      return '.mp4'
    case 'video/webm':
      return '.webm'
    case 'application/pdf':
      return '.pdf'
    case 'application/msword':
      return '.doc'
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return '.docx'
    case 'application/vnd.ms-excel':
      return '.xls'
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return '.xlsx'
    case 'application/vnd.ms-powerpoint':
      return '.ppt'
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return '.pptx'
    case 'application/zip':
      return '.zip'
    default:
      return ''
  }
}
