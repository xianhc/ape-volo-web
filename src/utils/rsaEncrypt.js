import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAYjJNTDWSTJ8RBnZ9hp7AS8eF\n' +
  'JvxpuZYTqGjD8qak45DKkAhpi7SNXDNbfDXNbUFeH465hwQIznS5fHdWgUAoqByG\n' +
  'jHoYu1jRhDx72EgKhuvDQ3sxwLJr0Ynx1f1Ny9yt8wtLaVc9KcJ8m/pHmmAGz+xf\n' +
  '7rzZ8dJvnee+OHMkNwIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}
