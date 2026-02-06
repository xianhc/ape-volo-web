<template>
  <div
    class="ape-volo-content relative h-full border-r shadow dark:shadow-gray-700"
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
        class="border-r-0 w-full"
        unique-opened
        @select="selectMenuItem"
      >
        <template v-for="item in routerStore.asyncRouters[0]?.children || []">
          <menu-node v-if="!item.hidden" :key="item.name" :router-info="item" />
        </template>
      </el-menu>
    </el-scrollbar>
    <div
      class="absolute bottom-4 right-4 w-8 h-8 bg-gray-50 dark:bg-gray-800 flex items-center justify-center rounded cursor-pointer"
      :class="isCollapse ? 'right-0 mx-auto' : 'right-4'"
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
</template>

<script setup>
  import menuNode from '@/views/layout/navigation/menuNode.vue'
  import { ref, provide, watchEffect, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRouterStore } from '@/pinia/modules/router'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'
  const appStore = useAppStore()
  const { device, config } = storeToRefs(appStore)

  defineOptions({
    name: 'NormalMode'
  })
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
    active.value = route.name
  })

  watchEffect(() => {
    if (device.value === 'mobile') {
      isCollapse.value = true
    } else {
      isCollapse.value = false
    }
  })

  provide('isCollapse', isCollapse)

  const selectMenuItem = (index) => {
    if (index === route.name) return
    if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
      window.open(index, '_blank')
      return
    } else {
      router.push({ name: index })
    }
  }

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
</script>
