<template>
  <div class="ape-volo-btn-list">
    <div class="crud-opts">
      <!-- 左侧按钮组 -->
      <span class="crud-opts-left">
        <slot name="left" />
        <!-- 新增和删除按钮 -->
        <el-button
          v-has-perm="props.perms.add"
          type="primary"
          icon="plus"
          @click="crud.toAdd"
        >
          {{ crud.getFormTitle() }}
        </el-button>
        <el-button
          v-has-perm="props.perms.del"
          type="danger"
          icon="delete"
          :disabled="!crud.multipleSelection.value.length"
          @click="crud.doBatchDelete"
          >删除
        </el-button>
        <el-button
          v-has-perm="props.perms.download"
          type="warning"
          icon="download"
          @click="crud.doExport"
          >导出
        </el-button>
        <slot name="right" />
      </span>

      <!-- 右侧按钮组 -->
      <div class="crud-opts-right">
        <!-- 改为普通容器，避免 el-button-group 的分隔边框出现“白线” -->
        <div class="crud-opts-actions">
          <!-- 显示隐藏查询模块 -->
          <el-tooltip
            :content="crud.searchToggle.value ? '隐藏搜索' : '显示搜索'"
            placement="top"
          >
            <el-button
              :type="crud.searchToggle.value ? 'primary' : ''"
              circle
              @click="toggleSearch"
              class="search-btn"
            >
              <el-icon>
                <Search />
              </el-icon>
            </el-button>
          </el-tooltip>

          <!-- 刷新按钮 -->
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="crud.refresh">
              <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject } from 'vue'
  import { Refresh, Search } from '@element-plus/icons-vue'

  const props = defineProps({
    perms: {
      type: Object,
      default: () => {
        return {}
      }
    }
  })

  const crud = inject('crud')

  const toggleSearch = () => {
    crud.searchToggle.value = !crud.searchToggle.value
  }
</script>

<style scoped>
  .crud-opts {
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .crud-opts-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .crud-opts-right {
    display: flex;
    align-items: center;
  }

  /* 替代 el-button-group：用 flex+gap 控制间距，不会出现组内分隔边框 */
  .crud-opts-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .crud-opts-right .el-button {
    border-radius: 50% !important;
  }

  .search-btn .el-button--primary .is-circle {
    border-color: #409eff !important; /* 用主色覆盖掉白边 */
  }
</style>
