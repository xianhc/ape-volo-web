import { ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import config from '@/setting'

const baseUrl = ref<string>(import.meta.env.VITE_BASE_API)

export const getBaseUrl = (): string => {
  return baseUrl.value === '/' ? '' : baseUrl.value
}

export default function getPageTitle(
  pageTitle?: string,
  route?: RouteLocationNormalizedLoaded
): string {
  if (pageTitle && route) {
    const title = fmtTitle(pageTitle, route)
    return `${title} - ${config.appName}`
  }
  return `${config.appName}`
}

export const fmtTitle = (
  title: string,
  now: RouteLocationNormalizedLoaded
): string => {
  const reg = /\$\{(.+?)\}/
  const reg_g = /\$\{(.+?)\}/g
  const result = title.match(reg_g)
  if (result) {
    result.forEach((item) => {
      const match = item.match(reg)
      if (match) {
        const key = match[1]
        const value = now.params[key] || now.query[key]
        title = title.replace(item, String(value))
      }
    })
  }
  return title
}
