<template>
  <div class="ape-volo-bg w-screen h-screen">
    <el-watermark
      v-if="config.showWatermark"
      :font="font"
      :z-index="9999"
      :gap="[180, 150]"
      class="absolute inset-0 pointer-events-none"
      :content="userStore.userInfo.nickName"
    />
    <Header />
    <div
      class="flex flex-row w-full pt-16 box-border h-full layout-root min-h-screen"
    >
      <Navigation
        v-if="
          config.sideMode === MenuNavigationType.SidebarNav ||
          config.sideMode === MenuNavigationType.DualSidebarNav ||
          (device === 'mobile' && config.sideMode === MenuNavigationType.TopNav)
        "
      />
      <div class="flex-1 px-2 w-0 h-full">
        <Tabs v-if="config.showTabs" />
        <div class="overflow-auto ape-container">
          <router-view v-if="reloadFlag" v-slot="{ Component, route }">
            <div
              id="base-load-dom"
              class="ape-body-h bg-gray-50 dark:bg-gray-800"
            >
              <transition
                mode="out-in"
                :name="route.meta.transitionType || config.transitionType"
              >
                <keep-alive :include="routerStore.keepAliveRouters">
                  <component
                    :is="Component"
                    :key="route.matched?.[1]?.name || route.name"
                  />
                </keep-alive>
              </transition>
            </div>
          </router-view>
          <BottomInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Navigation from '@/views/layout/navigation/index.vue'
  import Header from '@/views/layout/header/index.vue'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'
  import useResponsive from '@/hooks/responsive'
  import Tabs from './tabs/index.vue'
  import BottomInfo from '@/components/BottomInfo/index.vue'
  import { emitter } from '@/utils/bus.js'
  import { computed, onBeforeUnmount, onMounted, nextTick, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useRouterStore } from '@/pinia/modules/router'
  import { useUserStore } from '@/pinia/modules/user'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'
  import '@/style/transition.scss'
  const appStore = useAppStore()
  const { config, isDark, device } = storeToRefs(appStore)

  defineOptions({
    name: 'Layout'
  })

  useResponsive(true)

  const router = useRouter()
  const currentRoute = useRoute()
  const routerStore = useRouterStore()
  const userStore = useUserStore()

  const font = computed(() => ({
    color: isDark.value ? 'rgba(255,255,255, .15)' : 'rgba(0, 0, 0, .15)'
  }))

  onMounted(() => {
    // 挂载一些通用的事件
    emitter.on('reload', reload)
    if (userStore.loadingInstance) {
      userStore.loadingInstance.close()
    }
  })

  onBeforeUnmount(() => {
    emitter.off('reload', reload)
    if (reloadTimer) {
      window.clearTimeout(reloadTimer)
      reloadTimer = null
    }
  })

  const reloadFlag = ref(true)
  let reloadTimer = null
  const reload = async () => {
    if (reloadTimer) {
      window.clearTimeout(reloadTimer)
    }
    reloadTimer = window.setTimeout(async () => {
      if (currentRoute.meta.keepAlive) {
        reloadFlag.value = false
        await nextTick()
        reloadFlag.value = true
      } else {
        const title = currentRoute.meta.title
        router.push({ name: 'Reload', params: { title } })
      }
    }, 400)
  }
</script>

<style lang="scss"></style>
