<!--
  菜单搜索组件
  提供全局菜单快速搜索功能，支持键盘快捷键和搜索历史记录
  
  功能特性：
  - 快速搜索全局菜单项
  - 支持 Ctrl+K 键盘快捷键呼出
  - 智能搜索历史记录管理
  - 键盘导航支持（上下箭头、回车、ESC）
  - 响应式设计和暗色主题支持
  - 搜索结果实时过滤
  
  使用场景：
  - 全局导航栏搜索功能
  - 快速跳转到指定页面
  - 提升用户操作效率
  - 大型系统的菜单导航优化
-->
<template>
  <!-- 搜索触发器 -->
  <div @click="openSearchModal">
    <el-tooltip class="" effect="dark" content="菜单搜索" placement="bottom">
      <!-- 搜索按钮样式，支持暗色主题和悬停效果 -->
      <div
        class="group flex h-8 cursor-pointer items-center gap-3 rounded-2xl border-none bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-100 px-2 py-0.5 outline-none hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        <!-- 搜索图标 -->
        <el-icon class="w-8 h-8">
          <Search />
        </el-icon>
        <!-- 搜索文本提示 -->
        <span
          class="hidden text-xs text-gray-400 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-white duration-200 md:block transition-colors"
        >
          搜索
        </span>
        <!-- 快捷键提示 -->
        <span
          class="relative hidden rounded-sm rounded-r-xl px-1.5 py-1 text-xs leading-none border border-gray-300 bg-white text-gray-400 group-hover:text-gray-700 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300 dark:group-hover:text-white md:block transition-colors duration-200"
        >
          Ctrl <kbd class="font-sans">K</kbd>
        </span>
      </div>
    </el-tooltip>

    <!-- 搜索模态框 -->
    <el-dialog
      v-model="isModalVisible"
      width="30%"
      :append-to-body="true"
      :show-close="false"
      @close="closeSearchModal"
    >
      <template #header>
        <!-- 搜索输入框，支持多种键盘事件 -->
        <el-input
          ref="searchInputRef"
          v-model="searchKeyword"
          size="large"
          placeholder="输入菜单名称关键字搜索"
          clearable
          @keyup.enter="selectActiveResult"
          @input="updateSearchResults"
          @keydown.up.prevent="navigateResults('up')"
          @keydown.down.prevent="navigateResults('down')"
          @keydown.esc="closeSearchModal"
        >
          <template #prepend>
            <el-button icon="Search" />
          </template>
        </el-input>
      </template>

      <div class="search-result">
        <!-- 搜索历史显示区域 -->
        <template v-if="searchKeyword === '' && searchHistory.length > 0">
          <div class="search-history">
            <div class="search-history__title">
              搜索历史
              <!-- 清空历史按钮 -->
              <el-button
                type="primary"
                text
                size="small"
                class="search-history__clear"
                @click="clearHistory"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <!-- 历史记录列表 -->
            <ul class="search-history__list">
              <li
                v-for="(item, index) in searchHistory"
                :key="index"
                class="search-history__item"
                @click="navigateToRoute(item)"
              >
                <div class="search-history__icon">
                  <el-icon><Clock /></el-icon>
                </div>
                <span class="search-history__name">{{ item.title }}</span>
                <div class="search-history__action">
                  <el-icon @click.stop="removeHistoryItem(index)"
                    ><Close
                  /></el-icon>
                </div>
              </li>
            </ul>
          </div>
        </template>

        <!-- 搜索结果显示区域 -->
        <template v-else>
          <ul v-if="displayResults.length > 0">
            <li
              v-for="(item, index) in displayResults"
              :key="item.path"
              :class="[
                'search-result__item',
                {
                  'search-result__item--active': index === activeIndex
                }
              ]"
              @click="navigateToRoute(item)"
            >
              <!-- 菜单图标 -->
              <el-icon>
                <component :is="item.icon || Menu" />
              </el-icon>
              <!-- 菜单标题 -->
              <span class="ml-2">{{ item.title }}</span>
            </li>
          </ul>
        </template>

        <!-- 无搜索历史时的空状态 -->
        <div
          v-if="searchKeyword === '' && searchHistory.length === 0"
          class="no-history"
        >
          <p class="no-history__text">没有搜索历史</p>
        </div>
      </div>

      <!-- 操作提示区域 -->
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-[15px]">
            <!-- 回车键提示 -->
            <div class="key-box">
              <el-icon>
                <component :is="'enter'" />
              </el-icon>
              <span>选择</span>
            </div>
            <!-- 上下箭头键提示 -->
            <div class="arrow-box">
              <div class="arrow-up-down">
                <div>
                  <el-icon>
                    <Upload />
                  </el-icon>
                </div>
                <div class="ml-1">
                  <el-icon>
                    <Download />
                  </el-icon>
                </div>
              </div>
              <span>导航</span>
            </div>
            <!-- ESC 键提示 -->
            <div class="key-box">
              <el-icon>
                <component :is="'esc'" />
              </el-icon>
              <span>关闭</span>
            </div>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import {
    Clock,
    Close,
    Delete,
    Menu,
    Upload,
    Download
  } from '@element-plus/icons-vue'
  import { useRouterStore } from '@/pinia/modules/router'

  // 搜索历史本地存储配置
  const HISTORY_KEY = 'menu_search_history'
  const MAX_HISTORY = 5

  const routerStore = useRouterStore()
  const router = useRouter()

  // 组件状态管理
  const isModalVisible = ref(false) // 模态框显示状态
  const searchKeyword = ref('') // 搜索关键词
  const searchInputRef = ref() // 搜索输入框引用
  const excludedRoutes = ref(['/redirect', '/login', '/401', '/403', '/404']) // 排除的路由
  const menuItems = ref([]) // 所有菜单项
  const searchResults = ref([]) // 搜索结果
  const activeIndex = ref(-1) // 当前激活的结果索引
  const searchHistory = ref([]) // 搜索历史记录

  /**
   * 加载搜索历史记录
   * @function loadSearchHistory
   * @description 从 localStorage 读取搜索历史，并处理JSON解析异常
   */
  function loadSearchHistory() {
    const historyStr = localStorage.getItem(HISTORY_KEY)
    if (historyStr) {
      try {
        searchHistory.value = JSON.parse(historyStr)
      } catch {
        searchHistory.value = []
      }
    }
  }

  /**
   * 保存搜索历史记录
   * @function saveSearchHistory
   * @description 将当前搜索历史序列化后保存到 localStorage
   */
  function saveSearchHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(searchHistory.value))
  }

  /**
   * 添加搜索记录到历史
   * @function addToHistory
   * @param {Object} item - 要添加的菜单项对象
   * @description 添加搜索项到历史记录，去重并限制数量
   */
  function addToHistory(item) {
    // 检查是否已存在，如果存在则移除（避免重复）
    const index = searchHistory.value.findIndex((i) => i.path === item.path)

    // 如果存在则移除（避免重复记录）
    if (index !== -1) {
      searchHistory.value.splice(index, 1)
    }

    // 添加到历史记录开头
    searchHistory.value.unshift(item)

    // 限制历史记录数量，超出时删除最旧的记录
    if (searchHistory.value.length > MAX_HISTORY) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY)
    }

    saveSearchHistory()
  }

  /**
   * 移除指定的历史记录项
   * @function removeHistoryItem
   * @param {number} index - 要移除的历史记录索引
   * @description 从历史记录中删除指定索引的项目并保存
   */
  function removeHistoryItem(index) {
    searchHistory.value.splice(index, 1)
    saveSearchHistory()
  }

  /**
   * 清空所有搜索历史
   * @function clearHistory
   * @description 清除所有搜索历史记录，包括内存和本地存储
   */
  function clearHistory() {
    searchHistory.value = []
    localStorage.removeItem(HISTORY_KEY)
  }

  /**
   * 键盘快捷键事件处理
   * @function handleKeyDown
   * @param {KeyboardEvent} e - 键盘事件对象
   * @description 监听 Ctrl+K 组合键，触发搜索模态框
   */
  function handleKeyDown(e) {
    // 判断是否为Ctrl+K组合键（支持Mac的Cmd+K）
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault() // 阻止浏览器默认行为
      openSearchModal()
    }
  }

  /**
   * 组件挂载时的初始化操作
   */
  onMounted(() => {
    loadRoutes(
      routerStore.asyncRouters[0]?.children || [],
      routerStore.asyncRouters[0]?.path
    )
    loadSearchHistory()
    document.addEventListener('keydown', handleKeyDown)
  })

  /**
   * 组件卸载前的清理操作
   */
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })

  /**
   * 打开搜索模态框
   * @function openSearchModal
   * @description 重置搜索状态并显示搜索模态框，延迟聚焦输入框
   */
  function openSearchModal() {
    searchKeyword.value = ''
    activeIndex.value = -1
    isModalVisible.value = true
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 100)
  }

  /**
   * 关闭搜索模态框
   * @function closeSearchModal
   * @description 隐藏搜索模态框
   */
  function closeSearchModal() {
    isModalVisible.value = false
  }

  /**
   * 更新搜索结果
   * @function updateSearchResults
   * @description 根据搜索关键词实时过滤菜单项，支持模糊匹配
   */
  function updateSearchResults() {
    activeIndex.value = -1
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      searchResults.value = menuItems.value.filter((item) =>
        item.title.toLowerCase().includes(keyword)
      )
    } else {
      searchResults.value = []
    }
  }

  /**
   * 计算属性：显示的搜索结果
   * @computed displayResults
   * @returns {Array} 当前要显示的搜索结果列表
   */
  const displayResults = computed(() => searchResults.value)

  /**
   * 选择当前激活的搜索结果
   * @function selectActiveResult
   * @description 当用户按回车键时，选择当前高亮的搜索结果
   */
  function selectActiveResult() {
    if (displayResults.value.length > 0 && activeIndex.value >= 0) {
      navigateToRoute(displayResults.value[activeIndex.value])
    }
  }

  /**
   * 键盘导航搜索结果
   * @function navigateResults
   * @param {string} direction - 导航方向：'up' 或 'down'
   * @description 使用上下箭头键在搜索结果中导航，支持循环选择
   */
  function navigateResults(direction) {
    if (displayResults.value.length === 0) return

    if (direction === 'up') {
      activeIndex.value =
        activeIndex.value <= 0
          ? displayResults.value.length - 1
          : activeIndex.value - 1
    } else if (direction === 'down') {
      activeIndex.value =
        activeIndex.value >= displayResults.value.length - 1
          ? 0
          : activeIndex.value + 1
    }
  }

  /**
   * 导航到选中的路由
   * @function navigateToRoute
   * @param {Object} item - 菜单项对象，包含路径和标题信息
   * @description 关闭搜索框，添加到历史记录，并跳转到目标路由
   */
  function navigateToRoute(item) {
    closeSearchModal()
    // 添加到历史记录
    addToHistory(item)
    // 执行路由跳转
    router.push({ path: item.path })
  }

  /**
   * 递归加载路由配置
   * @function loadRoutes
   * @param {Array} routes - 路由配置数组
   * @param {String} basePath - 基础路由
   * @param {String} parentPath - 父级路由的完整路径，默认为空字符串
   * @description 递归遍历路由配置，提取可搜索的菜单项
   */
  function loadRoutes(routes, basePath = '', parentPath = '') {
    routes.forEach((route) => {
      // 首次递归时，parentPath 为空则用 basePath
      let curParent = parentPath || basePath || ''
      // 拼接路径，自动处理反斜杠
      let fullPath = curParent
        ? (curParent.endsWith('/') ? curParent.slice(0, -1) : curParent) +
          '/' +
          (route.path.startsWith('/') ? route.path.slice(1) : route.path)
        : route.path.startsWith('/')
        ? route.path
        : '/' + route.path

      // 统一路径为 /a/b/c 格式
      fullPath = fullPath.replace(/\/+/g, '/')

      // 排除特殊路由
      if (excludedRoutes.value.includes(fullPath)) return

      if (route.children && route.children.length) {
        // 多级嵌套递归
        loadRoutes(route.children, basePath, fullPath)
      } else if (route.meta?.title) {
        // 有 title 的路由作为菜单项
        const title = route.meta.title
        menuItems.value.push({
          title,
          path: fullPath,
          name: typeof route.name === 'string' ? route.name : undefined,
          icon: route.meta.icon,
          redirect:
            typeof route.redirect === 'string' ? route.redirect : undefined
        })
      }
    })
  }

  /**
   * 对外暴露的打开方法
   * @function open
   * @description 提供给父组件调用的打开搜索框方法
   */
  const open = () => {
    searchKeyword.value = ''
    activeIndex.value = -1
    isModalVisible.value = true
    setTimeout(() => {
      searchInputRef.value.focus()
    }, 100)
  }

  // 暴露方法给父组件使用
  defineExpose({ open })
</script>

<style scoped lang="scss">
  /* 搜索结果容器样式 */
  .search-result {
    max-height: 400px;
    overflow-y: auto;

    /* 重置列表样式 */
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    /* 搜索结果项样式 */
    &__item {
      display: flex;
      align-items: center;
      padding: 10px;
      text-align: left;
      cursor: pointer;

      /* 激活状态样式 - 当前选中的搜索结果 */
      &--active {
        background-color: var(--el-color-primary);
        color: var(--el-text-color-primary);
        border-radius: 4px;
      }
    }
  }

  /* 搜索历史区域样式 */
  .search-history {
    /* 历史记录标题栏 */
    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-size: 12px;
      line-height: 34px;
      color: var(--el-text-color-secondary);
    }

    /* 清空历史按钮 */
    &__clear {
      padding: 2px;
      font-size: 12px;

      &:hover {
        color: var(--el-color-danger);
      }
    }

    /* 历史记录列表容器 */
    &__list {
      padding: 0;
      margin: 0;
    }

    /* 历史记录图标 */
    &__icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }

    /* 历史记录名称 */
    &__name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: var(--el-text-color-primary);
      white-space: nowrap;
    }

    /* 历史记录操作按钮（删除） */
    &__action {
      padding: 4px;
      color: var(--el-text-color-secondary);
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s;

      &:hover {
        color: var(--el-color-danger);
        background-color: var(--el-fill-color);
      }
    }

    /* 历史记录项 */
    &__item {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 12px;
      cursor: pointer;

      &:hover {
        background-color: var(--el-fill-color-light);

        /* 悬停时显示删除按钮 */
        .search-history__action {
          opacity: 1;
        }
      }
    }
  }

  /* 无搜索历史时的空状态样式 */
  .no-history {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;

    &__text {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  /* 键盘操作提示样式 */
  .key-box {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .arrow-box {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .arrow-up-down {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  /* Element Plus 对话框底部样式适配 */
  :deep(.el-dialog__footer) {
    box-sizing: border-box;
    padding-top: 10px;
    text-align: right;
  }
</style>
