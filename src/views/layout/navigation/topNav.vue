<template>
  <div
    class="ape-volo-content h-[calc(100%-4px)] mx-2 flex items-center w-[calc(100vw-600px)] overflow-auto"
    ref="menuContainer"
  >
    <el-menu
      :default-active="active"
      mode="horizontal"
      class="border-r-0 w-full flex gap-1 items-center box-border h-[calc(100%-1px)]"
      unique-opened
      :ellipsis="shouldEllipsis"
      @select="selectMenuItem"
      ref="menuRef"
    >
      <template v-for="item in routerStore.asyncRouters[0].children">
        <menu-node
          v-if="!item.hidden"
          :key="item.name"
          :router-info="item"
          mode="horizontal"
        />
      </template>
    </el-menu>
  </div>
</template>

<script setup>
  import menuNode from '@/views/layout/navigation/menuNode.vue'
  import { ref, provide, watchEffect, onMounted, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRouterStore } from '@/pinia/modules/router'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'
  const appStore = useAppStore()
  const { device } = storeToRefs(appStore)

  defineOptions({
    name: 'HeadMode'
  })
  const route = useRoute()
  const router = useRouter()
  const routerStore = useRouterStore()
  const isCollapse = ref(false)
  const active = ref('')
  const menuRef = ref(null)
  const menuContainer = ref(null)
  const shouldEllipsis = ref(false)

  // 计算是否需要启用省略功能
  const calculateEllipsis = async () => {
    await nextTick()
    if (!menuRef.value || !menuContainer.value) return

    const menuItems = menuRef.value.$el.querySelectorAll(
      '.el-menu-item, .el-sub-menu'
    )
    let totalWidth = 0

    menuItems.forEach((item) => {
      totalWidth += item.offsetWidth
    })

    const containerWidth = menuContainer.value.offsetWidth
    shouldEllipsis.value = totalWidth > containerWidth
  }

  watchEffect(() => {
    active.value = route.name
  })

  watchEffect(() => {
    if (device.value === 'mobile') {
      isCollapse.value = true
    } else {
      isCollapse.value = false
    }
    // 设备变化时重新计算
    calculateEllipsis()
  })

  // 当路由变化时重新计算
  watchEffect(() => {
    if (route.name) {
      nextTick(calculateEllipsis)
    }
  })

  provide('isCollapse', isCollapse)

  onMounted(() => {
    calculateEllipsis()
    window.addEventListener('resize', calculateEllipsis)
  })

  const selectMenuItem = (index) => {
    if (index === route.name) return
    if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
      window.open(index, '_blank')
      return
    } else {
      router.push({ name: index })
    }
  }
</script>
