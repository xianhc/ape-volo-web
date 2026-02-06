import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/403',
    name: 'Forbidden',
    meta: {
      closeTab: true
    },
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/:catchAll(.*)',
    meta: {
      closeTab: true
    },
    component: () => import('@/views/error/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function setupRouter(app) {
  app.use(router)
}

export default router
