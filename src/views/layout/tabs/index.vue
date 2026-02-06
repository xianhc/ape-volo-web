<template>
  <div class="ape-volo-tabs">
    <el-tabs
      v-model="activeValue"
      :closable="!(historys.length === 1 && $route.name === defaultRouter)"
      type="card"
      class="ape-volo-content"
      @contextmenu.prevent="openContextMenu($event)"
      @tab-click="changeTab"
      @tab-remove="removeTab"
      @click.middle.prevent="middleCloseTab($event)"
    >
      <el-tab-pane
        v-for="item in historys"
        :key="getFmtString(item)"
        :label="item.meta.title"
        :name="getFmtString(item)"
        :tab="item"
        class="border-none"
      >
        <template #label>
          <el-icon v-if="item.meta.icon" size="16" class="mr-1">
            <component :is="item.meta.icon" />
          </el-icon>
          <span
            :tab="item"
            :class="
              activeValue === getFmtString(item)
                ? 'text-active'
                : 'text-gray-600 dark:text-slate-400 '
            "
            ><i
              :class="
                activeValue === getFmtString(item)
                  ? 'text-active'
                  : 'text-gray-600 dark:text-slate-400'
              "
            />
            {{ fmtTitle(item.meta.title, item) }}</span
          >
        </template>
      </el-tab-pane>
    </el-tabs>

    <ul
      v-show="contextMenuVisible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="closeAll">关闭所有</li>
      <li @click="closeLeft">关闭左侧</li>
      <li @click="closeRight">关闭右侧</li>
      <li @click="closeOther">关闭其他</li>
    </ul>
  </div>
</template>

<script setup>
  import { emitter } from '@/utils/bus.js'
  import { onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { fmtTitle } from '@/utils/index'
  import setting from '@/setting'

  defineOptions({
    name: 'HistoryComponent'
  })

  const route = useRoute()
  const router = useRouter()

  const defaultRouter = setting.defaultRouter

  const getFmtString = (item) => {
    return item.name
  }

  const historys = ref([])
  const activeValue = ref('')
  const contextMenuVisible = ref(false)

  //const userStore = useUserStore()

  const left = ref(0)
  const top = ref(0)
  const rightActive = ref('')

  const persistHistorys = () => {
    sessionStorage.setItem('historys', JSON.stringify(historys.value))
  }

  const rebuildHistoryMap = () => {
    historyMap.value = {}
    historys.value.forEach((item) => {
      historyMap.value[getFmtString(item)] = item
    })
  }

  const commitHistorys = () => {
    persistHistorys()
    rebuildHistoryMap()
    emitter.emit('setKeepAlive', historys.value)
  }

  const getTabNameFromEvent = (event) => {
    const target = event?.target
    if (!(target instanceof Element)) return ''
    const tabEl = target.closest?.('[id^="tab-"]')
    const id = tabEl?.id
    return id && id.startsWith('tab-') ? id.slice(4) : ''
  }

  const openContextMenu = (e) => {
    if (historys.value.length === 1 && route.name === defaultRouter) {
      return false
    }
    const tabName = getTabNameFromEvent(e)
    if (!tabName) return
    contextMenuVisible.value = true
    left.value = e.clientX
    top.value = e.clientY + 10
    rightActive.value = tabName
  }

  const closeAll = () => {
    historys.value = [
      {
        name: defaultRouter,
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      }
    ]
    router.push({ name: defaultRouter })
    contextMenuVisible.value = false
    commitHistorys()
  }
  const closeLeft = () => {
    const rightIndex = historys.value.findIndex(
      (item) => getFmtString(item) === rightActive.value
    )
    if (rightIndex < 0) return
    const right = historys.value[rightIndex]
    const activeIndex = historys.value.findIndex(
      (item) => getFmtString(item) === activeValue.value
    )
    historys.value.splice(0, rightIndex)
    if (rightIndex > activeIndex) {
      router.push(right)
    }
    contextMenuVisible.value = false
    commitHistorys()
  }
  const closeRight = () => {
    const leftIndex = historys.value.findIndex(
      (item) => getFmtString(item) === rightActive.value
    )
    if (leftIndex < 0) return
    const right = historys.value[leftIndex]
    const activeIndex = historys.value.findIndex(
      (item) => getFmtString(item) === activeValue.value
    )
    historys.value.splice(leftIndex + 1, historys.value.length)
    if (leftIndex < activeIndex) {
      router.push(right)
    }
    contextMenuVisible.value = false
    commitHistorys()
  }
  const closeOther = () => {
    const right = historys.value.find(
      (item) => getFmtString(item) === rightActive.value
    )
    if (!right) return
    historys.value = historys.value.filter(
      (item) => getFmtString(item) === rightActive.value
    )
    router.push(right)
    contextMenuVisible.value = false
    commitHistorys()
  }
  const setTab = (route) => {
    if (!route?.name) return
    if (!historys.value.some((item) => item.name === route.name)) {
      const obj = {}
      obj.name = route.name
      obj.meta = { ...route.meta }
      delete obj.meta.matched
      historys.value.push(obj)
    }
    activeValue.value = getFmtString(route)
    sessionStorage.setItem('activeValue', activeValue.value)
  }

  const historyMap = ref({})

  const changeTab = (TabsPaneContext) => {
    const name = TabsPaneContext?.props?.name
    if (!name) return
    const tab = historyMap.value[name]
    if (!tab) return
    router.push({
      name: tab.name
    })
  }
  const removeTab = (tab) => {
    const index = historys.value.findIndex((item) => getFmtString(item) === tab)
    if (index < 0) return
    if (getFmtString(route) === tab) {
      if (historys.value.length === 1) {
        router.push({ name: defaultRouter })
      } else {
        if (index < historys.value.length - 1) {
          router.push({
            name: historys.value[index + 1].name
          })
        } else {
          router.push({
            name: historys.value[index - 1].name
          })
        }
      }
    }
    historys.value.splice(index, 1)
    commitHistorys()
  }

  watch(
    () => contextMenuVisible.value,
    (visible) => {
      if (!visible) return
      document.body.addEventListener('click', onBodyClick, { once: true })
    }
  )

  const onBodyClick = () => {
    contextMenuVisible.value = false
  }

  onBeforeUnmount(() => {
    document.body.removeEventListener('click', onBodyClick)
  })

  watch(
    () => route.name,
    () => {
      if (route.name === 'Login' || route.name === 'Reload') {
        return
      }
      historys.value = historys.value.filter((item) => !item.meta.closeTab)
      setTab(route)
      commitHistorys()
    },
    { immediate: false }
  )

  const initPage = () => {
    const initHistorys = [
      {
        name: defaultRouter,
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      }
    ]
    historys.value =
      JSON.parse(sessionStorage.getItem('historys')) || initHistorys
    if (route.name !== 'Login' && route.name !== 'Reload') {
      setTab(route)
    }
    commitHistorys()
    if (window.sessionStorage.getItem('needCloseAll') === 'true') {
      closeAll()
      window.sessionStorage.removeItem('needCloseAll')
    }
  }
  initPage()

  const middleCloseTab = (e) => {
    if (historys.value.length === 1 && route.name === defaultRouter) {
      return false
    }
    const tabName = getTabNameFromEvent(e)
    if (!tabName) return
    removeTab(tabName)
  }
</script>

<style lang="scss" scoped>
  .contextmenu {
    @apply bg-white dark:bg-gray-900 w-28 m-0 py-2.5 px-0 border border-gray-200 text-sm shadow-md rounded absolute z-50 border-solid dark:border-gray-800;
  }

  .contextmenu li {
    @apply text-gray-700 dark:text-gray-200 text-base list-none px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer;
  }

  $base-tag-item-height: 4rem;

  .ape-volo-tabs {
    ::v-deep(.el-tabs--card > .el-tabs__header) {
      border: none;
    }
    ::v-deep(.el-tabs__nav-scroll) {
      padding: 4px 4px;
    }

    ::v-deep(.el-tabs__nav) {
      border: 0;
    }

    ::v-deep(.el-tabs__header) {
      border-bottom: 0;
    }
    ::v-deep(.el-tabs__item) {
      box-sizing: border-box;
      border: 1px solid var(--el-border-color-darker);
      border-radius: 2px;
      margin-right: 5px;
      margin-left: 2px;
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
      height: 34px;
      &.is-active {
        border: 1px solid var(--el-color-primary);
      }
    }
    ::v-deep(.el-tabs__item):first-child {
      border: 1px solid var(--el-border-color-darker);
      &.is-active {
        border: 1px solid var(--el-color-primary);
      }
    }
  }
</style>
