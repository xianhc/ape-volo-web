// 下载文件
export const downloadFile = (obj, fileName) => {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getExtensionFromMimeType = (mimeType) => {
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
