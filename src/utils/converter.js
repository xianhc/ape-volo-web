// 将字符串转换为布尔值
export const strToBool = (inputStr) => {
  if (inputStr !== null) {
    return String(inputStr).toLowerCase() === 'true'
  } else {
    return false
  }
}

export const formatBoolean = (bool) => {
  if (bool !== null) {
    return bool ? '是' : '否'
  } else {
    return ''
  }
}
