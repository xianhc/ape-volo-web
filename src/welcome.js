const getWelcomeMessage = () => {
  const frontendPort = process.env.VITE_CLI_PORT || '8001'
  const backendPort = process.env.VITE_SERVER_PORT || '8002'
  const basePath = process.env.VITE_BASE_PATH || 'http://localhost'

  return `
欢迎使用《ape-volo-admin》中后台权限管理系统
当前版本：v3.5.1
加群方式：微信号：apevolo<备注'加群'>   QQ群：839263566
官方网站：https://www.apevolo.com
接口文档地址：${basePath}:${backendPort}/swagger/api/index.html
前端运行地址：http://localhost:${frontendPort}
--------------------------------------版权声明------------------------------
** 版权所有方：xianhc **
** 移除版权标识需购买商用授权：https://www.apevolo.com/empower/index.html **
`
}

const greenText = (text) => `\x1b[32m${text}\x1b[0m`

export const printWelcomeOnce = () => {
  if (!process.env.__APE_WELCOME_PRINTED) {
    setTimeout(() => {
      console.log(greenText(getWelcomeMessage()))
      process.env.__APE_WELCOME_PRINTED = '1'
    }, 100)
  }
}
