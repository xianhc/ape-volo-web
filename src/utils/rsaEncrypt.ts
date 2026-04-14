import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

/**
 * RSA 公钥
 * @constant {string}
 */
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAYjJNTDWSTJ8RBnZ9hp7AS8eF\n' +
  'JvxpuZYTqGjD8qak45DKkAhpi7SNXDNbfDXNbUFeH465hwQIznS5fHdWgUAoqByG\n' +
  'jHoYu1jRhDx72EgKhuvDQ3sxwLJr0Ynx1f1Ny9yt8wtLaVc9KcJ8m/pHmmAGz+xf\n' +
  '7rzZ8dJvnee+OHMkNwIDAQAB'

/**
 * RSA 加密函数
 * @function encrypt
 * @description 使用 RSA 公钥对文本进行加密
 *
 * @param {string} txt - 需要加密的文本
 * @returns {string | false} 加密后的字符串，加密失败时返回 false
 *
 * @example
 * const password = 'myPassword123'
 * const encryptedPassword = encrypt(password)
 * if (encryptedPassword) {
 *   console.log('加密成功:', encryptedPassword)
 * } else {
 *   console.error('加密失败')
 * }
 */
export function encrypt(txt: string): string | false {
  const encryptor = new (JSEncrypt as any)()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
