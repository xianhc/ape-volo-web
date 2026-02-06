<!--
  图标选择器组件
  提供可视化的图标选择界面，支持 SVG 图标和 Element Plus 图标的选择
  
  功能特性：
  - 支持 SVG 图标和 Element Plus 图标两种类型
  - 提供图标搜索和过滤功能
  - 弹窗式选择界面，用户体验友好
  - 支持清空选择功能
  - 响应式设计，支持自定义宽度
  - 图标预览和选择一体化
  
  使用场景：
  - 菜单图标选择
  - 按钮图标配置
  - 系统设置中的图标选择
  - 动态表单中的图标字段
-->
<template>
  <div ref="iconSelectRef" :style="{ width: props.width }">
    <!-- 图标选择弹窗容器 -->
    <el-popover
      :visible="popoverVisible"
      :width="props.width"
      placement="bottom-end"
    >
      <template #reference>
        <!-- 触发器区域，点击展开图标选择面板 -->
        <div @click="popoverVisible = !popoverVisible">
          <slot>
            <!-- 默认输入框样式 -->
            <el-input
              v-model="selectedIcon"
              readonly
              placeholder="点击选择图标"
              class="reference"
            >
              <template #prepend>
                <!-- 根据图标类型展示对应的图标 -->
                <el-icon v-if="isElementIcon">
                  <component :is="selectedIcon" />
                </el-icon>
                <el-icon v-else>
                  <component :is="selectedIcon" />
                </el-icon>
              </template>
              <template #suffix>
                <!-- 清空按钮 -->
                <el-icon
                  v-if="selectedIcon"
                  style="margin-right: 8px"
                  @click.stop="clearSelectedIcon"
                >
                  <CircleClose />
                </el-icon>

                <!-- 展开/收起箭头 -->
                <el-icon
                  :style="{
                    transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform .5s'
                  }"
                >
                  <ArrowDown @click.stop="togglePopover" />
                </el-icon>
              </template>
            </el-input>
          </slot>
        </div>
      </template>

      <!-- 图标选择弹窗内容 -->
      <div ref="popoverContentRef">
        <!-- 图标搜索输入框 -->
        <el-input
          v-model="filterText"
          placeholder="搜索图标"
          clearable
          @input="filterIcons"
        />

        <!-- 图标类型选项卡 -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <!-- SVG 图标面板 -->
          <el-tab-pane label="SVG 图标" name="svg">
            <el-scrollbar height="300px">
              <ul class="icon-grid">
                <li
                  v-for="icon in filteredSvgIcons"
                  :key="'svg-' + icon"
                  class="icon-grid-item"
                  @click="selectIcon(icon)"
                >
                  <el-tooltip :content="icon" placement="bottom" effect="light">
                    <el-icon>
                      <component :is="icon" />
                    </el-icon>
                  </el-tooltip>
                </li>
              </ul>
            </el-scrollbar>
          </el-tab-pane>

          <!-- Element Plus 图标面板 -->
          <el-tab-pane label="Element 图标" name="element">
            <el-scrollbar height="300px">
              <ul class="icon-grid">
                <li
                  v-for="icon in filteredElementIcons"
                  :key="icon"
                  class="icon-grid-item"
                  @click="selectIcon(icon)"
                >
                  <el-icon>
                    <component :is="icon" />
                  </el-icon>
                </li>
              </ul>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import * as ElementPlusIconsVue from '@element-plus/icons-vue'
  import config from '@/setting'

  /**
   * 组件属性定义
   */
  const props = defineProps({
    /**
     * 双向绑定的图标值
     * @type {String}
     * @default ''
     * @description 当前选中的图标名称
     */
    modelValue: {
      type: String,
      default: ''
    },
    /**
     * 组件宽度
     * @type {String}
     * @default '500px'
     * @description 图标选择器的宽度，支持像素值或百分比
     */
    width: {
      type: String,
      default: '500px'
    }
  })

  /**
   * 组件事件定义
   */
  const emit = defineEmits(['update:modelValue'])

  // DOM 引用
  const iconSelectRef = ref()
  const popoverContentRef = ref()

  // 弹窗显示状态
  const popoverVisible = ref(false)

  // 当前激活的选项卡
  const activeTab = ref('svg')

  // 图标数据
  const svgIcons = ref([])
  const elementIcons = ref(Object.keys(ElementPlusIconsVue))

  // 双向绑定的选中图标
  const selectedIcon = defineModel('modelValue', {
    type: String,
    required: true,
    default: ''
  })

  // 搜索过滤相关
  const filterText = ref('')
  const filteredSvgIcons = ref([])
  const filteredElementIcons = ref(elementIcons.value)

  /**
   * 判断是否为 Element Plus 图标
   * @computed
   * @returns {boolean} 如果图标名称以 'el-icon' 开头则为 Element Plus 图标
   */
  const isElementIcon = computed(() => {
    return selectedIcon.value && selectedIcon.value.startsWith('el-icon')
  })

  /**
   * 加载 SVG 图标列表
   * @function loadIcons
   * @description 动态导入 assets/icons 目录下的所有 SVG 文件
   * 使用 Vite 的 import.meta.glob 功能实现文件批量导入
   */
  function loadIcons() {
    const list = config.logs
    console.log('加载图标配置:', list)

    // 使用 Vite 的 glob 导入功能获取所有 SVG 图标
    const icons = import.meta.glob('../../assets/icons/*.svg')

    for (const path in icons) {
      // 提取文件名作为图标名称
      const iconName = path.replace(/.*\/(.*)\.svg$/, '$1')
      svgIcons.value.push(iconName)
    }

    // 初始化过滤后的图标列表
    filteredSvgIcons.value = svgIcons.value
  }

  /**
   * 处理选项卡切换
   * @function handleTabClick
   * @param {Object} tabPane - 选项卡面板对象
   * @description 切换图标类型时重新应用过滤条件
   */
  function handleTabClick(tabPane) {
    activeTab.value = tabPane.props.name
    filterIcons()
  }

  /**
   * 过滤图标列表
   * @function filterIcons
   * @description 根据搜索文本和当前选项卡过滤图标列表
   * 支持模糊搜索，不区分大小写
   */
  function filterIcons() {
    if (activeTab.value === 'svg') {
      // 过滤 SVG 图标
      filteredSvgIcons.value = filterText.value
        ? svgIcons.value.filter((icon) =>
            icon.toLowerCase().includes(filterText.value.toLowerCase())
          )
        : svgIcons.value
    } else {
      // 过滤 Element Plus 图标
      filteredElementIcons.value = filterText.value
        ? elementIcons.value.filter((icon) =>
            icon.toLowerCase().includes(filterText.value.toLowerCase())
          )
        : elementIcons.value
    }
  }

  /**
   * 选择图标
   * @function selectIcon
   * @param {string} icon - 选中的图标名称
   * @description 更新选中的图标并关闭弹窗
   */
  function selectIcon(icon) {
    emit('update:modelValue', icon)
    popoverVisible.value = false
  }

  /**
   * 切换弹窗显示状态
   * @function togglePopover
   * @description 控制图标选择面板的显示和隐藏
   */
  function togglePopover() {
    popoverVisible.value = !popoverVisible.value
  }

  /**
   * 清空已选图标
   * @function clearSelectedIcon
   * @description 清除当前选中的图标，重置为空值
   */
  function clearSelectedIcon() {
    selectedIcon.value = ''
  }

  /**
   * 组件挂载后加载图标数据
   */
  onMounted(() => {
    loadIcons()
  })
</script>

<style scoped lang="scss">
  /* 输入框样式 - 让输入框和内部元素都显示为可点击状态 */
  .reference :deep(.el-input__wrapper),
  .reference :deep(.el-input__inner) {
    cursor: pointer;
  }

  /* 图标网格容器 - 使用 Flexbox 布局实现响应式图标排列 */
  .icon-grid {
    display: flex;
    flex-wrap: wrap;
  }

  /* 图标网格项 - 每个图标的容器样式 */
  .icon-grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin: 4px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: all 0.3s;
  }

  /* 图标项悬停效果 - 提供视觉反馈增强用户体验 */
  .icon-grid-item:hover {
    border-color: #4080ff;
    transform: scale(1.2);
  }
</style>
