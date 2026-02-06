import ElementPlus from 'element-plus'
import { setupDirective } from '@/directive'
import { setupRouter } from '@/router'
import { setupStore } from '@/pinia'
import { setupIcons } from './icons'
import { setupPermission } from './permission'

export default {
  install(app) {
    // Element Plus
    app.use(ElementPlus)
    // 自定义权限指令
    setupDirective(app)
    // 路由
    setupRouter(app)
    // 仓储
    setupStore(app)
    // Icon
    setupIcons(app)
    // 路由守卫
    setupPermission()
  }
}
