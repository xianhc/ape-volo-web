<template>
  <template v-if="!routerInfo.hidden">
    <!-- 有子菜单的情况 -->
    <el-sub-menu
      v-if="hasVisibleChildren"
      ref="subMenu"
      :index="routerInfo.name"
      class="sub-menu dark:text-slate-300 relative"
    >
      <template #title>
        <div
          v-if="!isCollapse"
          class="flex items-center"
          :style="{ height: sideHeight }"
        >
          <el-icon v-if="routerInfo.meta.icon">
            <component :is="routerInfo.meta.icon" />
          </el-icon>
          <span>{{ routerInfo.meta.title }}</span>
        </div>
        <template v-else>
          <el-icon v-if="routerInfo.meta.icon">
            <component :is="routerInfo.meta.icon" />
          </el-icon>
          <span>{{ routerInfo.meta.title }}</span>
        </template>
      </template>

      <!-- 递归渲染子菜单 -->
      <AsideComponent
        v-for="item in visibleChildren"
        :key="item.name"
        :router-info="item"
        :mode="mode"
      />
    </el-sub-menu>

    <!-- 单个菜单项的情况 -->
    <el-menu-item
      v-else
      :index="routerInfo.name"
      :style="{ height: sideHeight }"
    >
      <el-icon v-if="routerInfo.meta.icon">
        <component :is="routerInfo.meta.icon" />
      </el-icon>
      <template v-else>
        {{ isCollapse ? routerInfo.meta.title[0] : '' }}
      </template>
      <template #title>
        {{ routerInfo.meta.title }}
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
  import { computed, inject } from 'vue'
  import { useAppStore } from '@/pinia'
  import { storeToRefs } from 'pinia'

  defineOptions({
    name: 'AsideComponent'
  })

  const props = defineProps({
    routerInfo: {
      type: Object,
      default: () => null
    },
    mode: {
      type: String,
      default: 'vertical'
    }
  })

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  const isCollapse = inject('isCollapse', {
    default: false
  })

  // 计算菜单高度
  const sideHeight = computed(() => {
    return config.value.layoutSideItemHeight + 'px'
  })

  // 计算可见的子路由
  const visibleChildren = computed(() => {
    return props.routerInfo.children?.filter((item) => !item.hidden) || []
  })

  // 判断是否有可见的子菜单
  const hasVisibleChildren = computed(() => {
    return visibleChildren.value.length > 0
  })
</script>

<style lang="scss">
  .sub-menu {
    .el-sub-menu__title {
      height: v-bind('sideHeight') !important;
    }
  }
</style>
