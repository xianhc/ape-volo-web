<template>
  <div class="h-full">
    <div
      v-if="mode === 'TopNav'"
      class="bg-white h-[calc(100%-4px)] text-slate-700 dark:text-slate-300 mx-2 dark:bg-slate-900 flex items-center w-[calc(100vw-600px)] overflow-auto"
    >
      <el-menu
        :default-active="routerStore.topActive"
        mode="horizontal"
        class="!border-r-0 border-b-0 w-full flex gap-1 items-center box-border h-[calc(100%-1px)]"
        unique-opened
        @select="handleTopSelect"
      >
        <template v-for="item in routerStore.topMenu">
          <menu-node
            v-if="!item.hidden"
            :key="item.name"
            :router-info="item"
            mode="horizontal"
          />
        </template>
      </el-menu>
    </div>
    <div
      v-if="mode === 'SidebarNav'"
      class="relative h-full bg-white text-slate-700 dark:text-slate-300 dark:bg-slate-900 shadow dark:shadow-gray-700"
      :class="isCollapse ? '' : '  px-2'"
      :style="{
        width: layoutSideWidth + 'px'
      }"
    >
      <el-scrollbar>
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="active"
          class="!border-r-0 w-full"
          unique-opened
          @select="handleLeftSelect"
        >
          <template v-for="item in routerStore.leftMenu">
            <menu-node
              v-if="!item.hidden"
              :key="item.name"
              :router-info="item"
            />
          </template>
        </el-menu>
      </el-scrollbar>
      <div
        class="absolute bottom-8 right-2 w-8 h-8 bg-gray-50 dark:bg-slate-800 flex items-center justify-center rounded cursor-pointer"
        :class="isCollapse ? 'right-0 left-0 mx-auto' : 'right-2'"
        @click="toggleCollapse"
      >
        <el-icon v-if="!isCollapse">
          <DArrowLeft />
        </el-icon>
        <el-icon v-else>
          <DArrowRight />
        </el-icon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import MenuNode from '@/views/layout/navigation/menuNode.vue'
  import { ref, provide, watchEffect, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRouterStore } from '@/pinia/modules/router'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'
  const appStore = useAppStore()
  const { device, config } = storeToRefs(appStore)

  defineOptions({
    name: 'CombinationNav'
  })

  withDefaults(
    defineProps<{
      mode?: string
    }>(),
    {
      mode: 'SidebarNav'
    }
  )

  const route = useRoute()
  const router = useRouter()
  const routerStore = useRouterStore()
  const isCollapse = ref(false)
  const active = ref('')
  const layoutSideWidth = computed(() => {
    if (!isCollapse.value) {
      return config.value.layoutSideWidth
    } else {
      return config.value.layoutSideCollapsedWidth
    }
  })
  watchEffect(() => {
    active.value = String(route.name || '')
  })

  watchEffect(() => {
    if (device.value === 'mobile') {
      isCollapse.value = true
    } else {
      isCollapse.value = false
    }
  })

  provide('isCollapse', isCollapse)

  const selectMenuItem = (
    index: string,
    _: unknown,
    __: unknown,
    top: boolean
  ) => {
    if (index === String(route.name || '')) return
    if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
      window.open(index, '_blank')
      return
    }

    if (!top) {
      router.push({ name: index })
      return
    }
    const leftMenu = routerStore.setLeftMenu(index)
    if (!leftMenu) {
      router.push({ name: index })
      return
    }
    const firstMenu = leftMenu.find(
      (item) =>
        !item.hidden &&
        item.path.indexOf('http://') === -1 &&
        item.path.indexOf('https://') === -1
    )
    if (firstMenu?.name) {
      router.push({ name: firstMenu.name })
    }
  }

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  const handleTopSelect = (index: string) =>
    selectMenuItem(index, undefined, undefined, true)
  const handleLeftSelect = (index: string) =>
    selectMenuItem(index, undefined, undefined, false)
</script>
