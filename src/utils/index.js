import { ref } from 'vue'
import config from '@/setting'

const baseUrl = ref(import.meta.env.VITE_BASE_API)

export const getBaseUrl = () => {
  return baseUrl.value === '/' ? '' : baseUrl.value
}

export default function getPageTitle(pageTitle, route) {
  if (pageTitle) {
    const title = fmtTitle(pageTitle, route)
    return `${title} - ${config.appName}`
  }
  return `${config.appName}`
}

export const fmtTitle = (title, now) => {
  const reg = /\$\{(.+?)\}/
  const reg_g = /\$\{(.+?)\}/g
  const result = title.match(reg_g)
  if (result) {
    result.forEach((item) => {
      const key = item.match(reg)[1]
      const value = now.params[key] || now.query[key]
      title = title.replace(item, value)
    })
  }
  return title
}
