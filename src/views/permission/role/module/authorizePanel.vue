<template>
  <el-drawer
    v-if="dialogFormVisible"
    v-model="dialogFormVisible"
    :size="appStore.drawerSize"
    title="权限配置"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="角色菜单">
        <div>
          <div class="sticky top-0.5 z-10">
            <el-input
              v-model="filterMenuText"
              class="w-3/5"
              placeholder="请输入关键字筛选"
            />
            <el-button class="float-right" type="primary" @click="saveMenuTree"
              >确 定
            </el-button>
          </div>
          <div class="tree-content clear-both">
            <el-scrollbar>
              <el-tree
                ref="menuTree"
                :data="menuTreeData"
                :default-checked-keys="menuTreeIds"
                :props="{
                  children: 'children',
                  label: 'title',
                  isLeaf: 'leaf'
                }"
                default-expand-all
                highlight-current
                node-key="id"
                show-checkbox
                check-strictly
                :filter-node-method="filterMenuNode"
              >
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="角色Api">
        <div>
          <div class="sticky top-0.5 z-10">
            <el-input
              v-model="filterApiText"
              class="w-3/5"
              placeholder="请输入关键字筛选"
            />
            <el-button class="float-right" type="primary" @click="saveApiTree"
              >确 定
            </el-button>
          </div>
          <div class="tree-content clear-both">
            <el-scrollbar>
              <el-tree
                ref="apiTree"
                :data="apiTreeData"
                :default-checked-keys="apiTreeIds"
                :props="{
                  children: 'children',
                  label: 'label',
                  isLeaf: 'leaf'
                }"
                default-expand-all
                highlight-current
                node-key="id"
                show-checkbox
                check-strictly
                :filter-node-method="filterApiNode"
              >
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup>
  import { getAll as getAllMenu } from '@/api/permission/menu'
  import { getAll as getAllApi } from '@/api/permission/api'
  import { single, editRoleMenu, editRoleApi } from '@/api/permission/role'
  import { nextTick, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useAppStore } from '@/pinia'

  defineOptions({
    name: 'Authorize'
  })

  const appStore = useAppStore()

  const roleId = ref(0)

  const filterMenuText = ref('')
  const menuTreeData = ref([])
  const menuTreeIds = ref([])

  const filterApiText = ref('')
  const apiTreeData = ref([])
  const apiTreeIds = ref([])

  const init = async () => {
    const resRole = await single({ id: roleId.value })
    const resMenu = await getAllMenu()
    menuTreeData.value = resMenu.data
    const roleMenuList = resRole.data.menuList
    const menuIdArr = []
    roleMenuList.forEach((item) => {
      menuIdArr.push(Number(item.id))
    })
    menuTreeIds.value = menuIdArr

    const resApi = await getAllApi()
    apiTreeData.value = resApi.data
    const roleApiList = resRole.data.apiList
    const apiIdArr = []
    roleApiList.forEach((item) => {
      apiIdArr.push(Number(item.id))
    })
    apiTreeIds.value = apiIdArr

    // 注意：等 nextTick 后再设置选中
    await nextTick(() => {
      if (menuTree.value && menuIdArr.length) {
        menuTree.value.setCheckedKeys(menuIdArr)
      }
      if (apiTree.value && apiIdArr.length) {
        apiTree.value.setCheckedKeys(apiIdArr)
      }
    })
  }

  const menuTree = ref(null)
  const saveMenuTree = async () => {
    const checkArr = menuTree.value.getCheckedNodes(false, false)
    await editRoleMenu({
      menuIdArray: checkArr.map((item) => item.id),
      Id: roleId.value
    })
    ElMessage({
      type: 'success',
      message: '角色菜单设置成功!'
    })
  }

  const apiTree = ref(null)
  const saveApiTree = async () => {
    const checkArr = apiTree.value.getCheckedNodes(false, false)
    await editRoleApi({
      apiIdArray: checkArr.map((item) => item.id),
      Id: roleId.value
    })
    ElMessage({
      type: 'success',
      message: '角色Api设置成功!'
    })
  }

  const filterMenuNode = (value, data) => {
    if (!value) return true
    return data.title.indexOf(value) !== -1
  }
  watch(filterMenuText, (val) => {
    menuTree.value.filter(val)
  })

  const filterApiNode = (value, data) => {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }

  watch(filterApiText, (val) => {
    apiTree.value.filter(val)
  })

  const dialogFormVisible = ref(false)
  const openAuthorizeDialog = async (id) => {
    roleId.value = id
    dialogFormVisible.value = true
    await init() // 初始化数据
  }

  defineExpose({ openAuthorizeDialog })
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    span + span {
      @apply ml-3;
    }
  }
</style>
