/**
 * 检测是否为外部链接
 * @function isExternal
 * @description 判断给定的路径是否为外部链接（HTTP/HTTPS/邮件/电话）
 *
 * 支持的协议：
 * - http:// 和 https:// - 网页链接
 * - mailto: - 邮件链接
 * - tel: - 电话链接
 *
 * @param {string} path - 要检测的路径字符串
 * @returns {boolean} 如果是外部链接返回 true，否则返回 false
 *
 * @example
 * isExternal('https://example.com') // true
 * isExternal('mailto:user@example.com') // true
 * isExternal('tel:+1234567890') // true
 * isExternal('/internal/path') // false
 * isExternal('relative/path') // false
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证用户名是否在白名单中
 * @function validUsername
 * @description 检查用户名是否为预定义的有效用户名
 *
 * 白名单机制：
 * - 只允许特定的用户名通过验证
 * - 自动去除前后空格
 * - 区分大小写
 *
 * @param {string} str - 要验证的用户名
 * @returns {boolean} 如果用户名在白名单中返回 true，否则返回 false
 *
 * @example
 * validUsername('admin') // true
 * validUsername('editor') // true
 * validUsername('user') // false
 * validUsername(' admin ') // true (自动去除空格)
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 验证 URL 格式是否正确
 * @function validURL
 * @description 使用正则表达式验证 URL 的完整格式，包括协议、域名、端口、路径等
 *
 * 支持的协议：http、https、ftp
 * 支持的格式：
 * - IP 地址（IPv4）
 * - 域名（包括各种顶级域名）
 * - 端口号
 * - 路径和查询参数
 * - 用户认证信息
 *
 * @param {string} url - 要验证的 URL 字符串
 * @returns {boolean} 如果 URL 格式正确返回 true，否则返回 false
 *
 * @example
 * validURL('https://www.example.com') // true
 * validURL('http://192.168.1.1:8080/path') // true
 * validURL('ftp://user:pass@ftp.example.com') // true
 * validURL('invalid-url') // false
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * 验证字符串是否全为小写字母
 * @function validLowerCase
 * @description 检查字符串是否仅包含小写英文字母
 *
 * @param {string} str - 要验证的字符串
 * @returns {boolean} 如果全为小写字母返回 true，否则返回 false
 *
 * @example
 * validLowerCase('hello') // true
 * validLowerCase('Hello') // false
 * validLowerCase('hello123') // false
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 验证字符串是否全为大写字母
 * @function validUpperCase
 * @description 检查字符串是否仅包含大写英文字母
 *
 * @param {string} str - 要验证的字符串
 * @returns {boolean} 如果全为大写字母返回 true，否则返回 false
 *
 * @example
 * validUpperCase('HELLO') // true
 * validUpperCase('Hello') // false
 * validUpperCase('HELLO123') // false
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 验证字符串是否全为英文字母
 * @function validAlphabets
 * @description 检查字符串是否仅包含英文字母（大小写均可）
 *
 * @param {string} str - 要验证的字符串
 * @returns {boolean} 如果全为英文字母返回 true，否则返回 false
 *
 * @example
 * validAlphabets('Hello') // true
 * validAlphabets('HelloWorld') // true
 * validAlphabets('Hello123') // false
 * validAlphabets('Hello!') // false
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 验证邮箱地址格式
 * @function validEmail
 * @description 使用正则表达式验证邮箱地址的标准格式
 *
 * 验证规则：
 * - 用户名部分：支持字母、数字、特殊字符
 * - @ 符号分隔
 * - 域名部分：支持多级域名和各种顶级域名
 * - 特殊字符处理：引号包裹的用户名
 *
 * @param {string} email - 要验证的邮箱地址
 * @returns {boolean} 如果邮箱格式正确返回 true，否则返回 false
 *
 * @example
 * validEmail('user@example.com') // true
 * validEmail('user.name@example.co.uk') // true
 * validEmail('user+tag@example.org') // true
 * validEmail('invalid.email') // false
 */
export function validEmail(email) {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 验证中国大陆手机号码格式
 * @function isvalidPhone
 * @description 验证11位中国大陆手机号码格式
 *
 * 支持的号段：
 * - 13x 系列
 * - 14x 系列
 * - 15x 系列
 * - 17x 系列
 * - 18x 系列
 *
 * @param {string} phone - 要验证的手机号码
 * @returns {boolean} 如果手机号格式正确返回 true，否则返回 false
 *
 * @example
 * isvalidPhone('13812345678') // true
 * isvalidPhone('15987654321') // true
 * isvalidPhone('12345678901') // false
 */
export function isvalidPhone(phone) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(phone)
}

/**
 * 验证是否为字符串类型
 * @function isString
 * @description 检查参数是否为字符串类型（包括 String 对象）
 *
 * @param {any} str - 要检查的参数
 * @returns {boolean} 如果是字符串类型返回 true，否则返回 false
 *
 * @example
 * isString('hello') // true
 * isString(new String('hello')) // true
 * isString(123) // false
 * isString(null) // false
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * 验证是否为数组类型
 * @function isArray
 * @description 兼容性数组类型检查，支持旧版本浏览器
 *
 * 检查机制：
 * - 优先使用原生 Array.isArray 方法
 * - 回退到 Object.prototype.toString 方法
 *
 * @param {any} arg - 要检查的参数
 * @returns {boolean} 如果是数组类型返回 true，否则返回 false
 *
 * @example
 * isArray([1, 2, 3]) // true
 * isArray(new Array()) // true
 * isArray('not array') // false
 * isArray({}) // false
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * Element Plus 表单验证器 - IP 地址验证
 * @function validateIP
 * @description 用于 Element Plus 表单的 IP 地址格式验证器
 *
 * 验证规则：
 * - 支持标准 IPv4 地址格式
 * - 每个段的取值范围：0-255
 * - 允许空值（可选字段）
 * - 自动跳过空字符串、undefined、null
 *
 * @param {Object} rule - Element Plus 验证规则对象
 * @param {string} value - 要验证的 IP 地址值
 * @param {Function} callback - 验证结果回调函数
 *
 * @example
 * // 在 Element Plus 表单中使用
 * const rules = {
 *   serverIp: [
 *     { validator: validateIP, trigger: 'blur' }
 *   ]
 * }
 *
 * validateIP(null, '192.168.1.1', callback) // 通过验证
 * validateIP(null, '256.1.1.1', callback) // 验证失败
 * validateIP(null, '', callback) // 通过验证（允许空值）
 */
export function validateIP(rule, value, callback) {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

/**
 * Element Plus 表单验证器 - 手机号码和固话号码验证
 * @function validatePhoneTwo
 * @description 用于 Element Plus 表单的电话号码验证器，同时支持手机号和固话
 *
 * 支持格式：
 * - 手机号：1[34578]xxxxxxxxx（11位）
 * - 固话：区号-号码格式（如：010-12345678）
 * - 允许空值（可选字段）
 *
 * @param {Object} rule - Element Plus 验证规则对象
 * @param {string} value - 要验证的电话号码值
 * @param {Function} callback - 验证结果回调函数
 *
 * @example
 * // 在 Element Plus 表单中使用
 * const rules = {
 *   contactPhone: [
 *     { validator: validatePhoneTwo, trigger: 'blur' }
 *   ]
 * }
 *
 * validatePhoneTwo(null, '13812345678', callback) // 通过验证
 * validatePhoneTwo(null, '010-12345678', callback) // 通过验证
 * validatePhoneTwo(null, '', callback) // 通过验证（允许空值）
 */
export function validatePhoneTwo(rule, value, callback) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的电话号码或者固话号码'))
    } else {
      callback()
    }
  }
}

/**
 * Element Plus 表单验证器 - 固定电话验证
 * @function validateTelephone
 * @description 用于 Element Plus 表单的固定电话号码验证器
 *
 * 验证格式：
 * - 标准格式：区号-号码（如：010-1234567）
 * - 区号：0 开头的 2-3 位数字
 * - 号码：7-8 位数字
 * - 允许空值（可选字段）
 *
 * @param {Object} rule - Element Plus 验证规则对象
 * @param {string} value - 要验证的固话号码值
 * @param {Function} callback - 验证结果回调函数
 *
 * @example
 * // 在 Element Plus 表单中使用
 * const rules = {
 *   telephone: [
 *     { validator: validateTelephone, trigger: 'blur' }
 *   ]
 * }
 *
 * validateTelephone(null, '010-1234567', callback) // 通过验证
 * validateTelephone(null, '021-87654321', callback) // 通过验证
 * validateTelephone(null, '010-123456', callback) // 验证失败（号码位数不足）
 */
export function validateTelephone(rule, value, callback) {
  const reg = /0\d{2}-\d{7,8}/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

/**
 * Element Plus 表单验证器 - 手机号码验证
 * @function validatePhone
 * @description 用于 Element Plus 表单的手机号码验证器
 *
 * 验证规则：
 * - 11 位手机号码
 * - 第一位固定为 1
 * - 第二位为 3、4、5、7、8 中的一个
 * - 后续 9 位为任意数字
 * - 允许空值（可选字段）
 *
 * @param {Object} rule - Element Plus 验证规则对象
 * @param {string} value - 要验证的手机号码值
 * @param {Function} callback - 验证结果回调函数
 *
 * @example
 * // 在 Element Plus 表单中使用
 * const rules = {
 *   mobile: [
 *     { validator: validatePhone, trigger: 'blur' }
 *   ]
 * }
 *
 * validatePhone(null, '13812345678', callback) // 通过验证
 * validatePhone(null, '15987654321', callback) // 通过验证
 * validatePhone(null, '12345678901', callback) // 验证失败（第二位不符合规则）
 */
export function validatePhone(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

/**
 * Element Plus 表单验证器 - 身份证号码验证
 * @function validateIdNo
 * @description 用于 Element Plus 表单的身份证号码验证器
 *
 * 支持格式：
 * - 15 位身份证号码（旧版）
 * - 18 位身份证号码（新版）
 * - 17 位数字 + 1 位校验码（X 或 x）
 * - 允许空值（可选字段）
 *
 * 验证规则：
 * - 15 位：全数字
 * - 18 位：全数字
 * - 17 位数字 + X/x：最后一位可以是 X 或 x
 *
 * @param {Object} rule - Element Plus 验证规则对象
 * @param {string} value - 要验证的身份证号码值
 * @param {Function} callback - 验证结果回调函数
 *
 * @example
 * // 在 Element Plus 表单中使用
 * const rules = {
 *   idCard: [
 *     { validator: validateIdNo, trigger: 'blur' }
 *   ]
 * }
 *
 * validateIdNo(null, '110101199003074517', callback) // 通过验证（18位）
 * validateIdNo(null, '11010119900307451X', callback) // 通过验证（17位+X）
 * validateIdNo(null, '110101900307451', callback) // 通过验证（15位）
 * validateIdNo(null, '1234567890', callback) // 验证失败（位数不符）
 */
export function validateIdNo(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}
