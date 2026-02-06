<template>
  <div
    class="ape-volo-content flex justify-between fixed top-0 left-0 right-0 z-10 h-16 shadow dark:shadow-gray-700 items-center px-2"
  >
    <div class="flex items-center min-w-0 flex-1">
      <div
        class="flex items-center cursor-pointer flex-shrink-0"
        :class="isMobile ? '' : 'min-w-48'"
        @click="router.push({ path: '/' })"
      >
        <img
          alt
          class="h-[46px] w-[50px] bg-white rounded-full"
          :src="setting.appLogo"
        />
        <div
          v-if="!isMobile"
          class="inline-flex font-bold text-2xl ml-2 whitespace-nowrap"
        >
          {{ setting.appName }}
        </div>
      </div>

      <el-breadcrumb
        v-show="!isMobile"
        v-if="config.sideMode !== MenuNavigationType.TopNav"
        class="ml-4 min-w-0"
      >
        <el-breadcrumb-item
          v-for="item in matched.slice(1, matched.length)"
          :key="item.path"
        >
          {{ fmtTitle(item.meta.title, route) }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <Aside
        v-if="config.sideMode === MenuNavigationType.TopNav && !isMobile"
        class="flex-1 min-w-0 ml-4"
      />
    </div>

    <div class="ml-2 flex items-center flex-shrink-0 gap-2">
      <tools />
      <el-dropdown>
        <div class="flex justify-center items-center h-full">
          <span
            class="cursor-pointer flex justify-center items-center text-black dark:text-gray-100 gap-1"
          >
            <el-avatar
              v-if="userStore.userInfo.headerImg"
              :size="30"
              :src="getBaseUrl() + userStore.userInfo.headerImg"
            />
            <el-avatar v-else :size="30" :src="noAvatar" />
            <span v-show="!isMobile" class="max-w-20 truncate">{{
              userStore.userInfo.nickName
            }}</span>
            <el-icon>
              <arrow-down />
            </el-icon>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="user" @click="toPerson">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item icon="logout" @click="userStore.LoginOut">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
  import tools from './tools.vue'
  import { getBaseUrl } from '@/utils/index'
  import noAvatar from '@/assets/noAvatar.png'
  import { useUserStore } from '@/pinia/modules/user'
  import { useRoute, useRouter } from 'vue-router'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'
  import { computed } from 'vue'
  import { fmtTitle } from '@/utils/index'
  import Aside from '@/views/layout/navigation/index.vue'
  import { MenuNavigationType } from '@/enums/MenuNavigationType'
  import setting from '@/setting'
  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { device, config } = storeToRefs(appStore)
  const isMobile = computed(() => {
    return device.value === 'mobile'
  })
  const toPerson = () => {
    router.push({ name: 'personalCenter' })
  }
  const matched = computed(() => route.meta.matched)
</script>
