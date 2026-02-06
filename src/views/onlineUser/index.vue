<template>
  <div>
    <!-- <div class="p-10 rounded"></div> -->
    <div class="ape-volo-table">
      <div class="ape-volo-btn-list">
        <el-button type="primary" icon="Refresh" @click="refresh"
          >刷新</el-button
        >
        <el-button
          v-has-role="['admin']"
          type="warning"
          icon="download"
          @click="doExport()"
          >导出
        </el-button>
      </div>
      <el-table
        ref="tableRef"
        :data="data"
        v-loading="loading"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column align="left" prop="account" label="登录账号" />
        <el-table-column align="left" prop="accessToken" label="令牌" />
        <el-table-column align="left" prop="nickName" label="昵称" />
        <el-table-column align="left" prop="deptName" label="部门" />
        <el-table-column align="left" prop="ip" label="Ip地址" />
        <el-table-column align="left" prop="address" label="Ip归属地" />
        <el-table-column align="left" prop="operatingSystem" label="操作系统" />
        <el-table-column align="left" prop="deviceType" label="设备类型" />
        <el-table-column align="left" prop="browserName" label="浏览器" />
        <el-table-column align="left" prop="version" label="版本号" />
        <el-table-column align="left" prop="loginTime" label="登录时间" />
        <el-table-column align="left" label="操作">
          <template #default="scope">
            <el-button
              v-has-role="'admin'"
              class="dropout-btn"
              icon="SwitchButton"
              type="danger"
              link
              @click="dropOut(scope.row)"
              >强退
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { get, del, download } from '@/api/onlineUser'
  import { useCrud } from '@/components/Crud/UseCrud'
  import { ElMessageBox, ElMessage } from 'element-plus'

  defineOptions({
    name: 'OnlineUser'
  })

  const searchInfo = ref({})

  const { data, loading, refresh, pagination, doExport } = useCrud({
    crudMethod: { list: get, del: del, download: download },
    defaultForm: () => ({}),
    searchInfo
  })

  const dropOut = (row) => {
    ElMessageBox.confirm(`确定要强退${row.account}吗, 是否继续?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        return del({ IdArray: [row.accessToken] })
      })
      .then(() => {
        ElMessage({
          type: 'success',
          message: '登出成功!'
        })
        refresh()
      })
      .catch((err) => {
        if (err === 'cancel' || err === 'close') return
        console.error(err)
      })
  }
</script>

<style scoped>
  /* link 模式下强制文字/图标走 danger 红色 */
  .dropout-btn,
  .dropout-btn :deep(.el-icon),
  .dropout-btn :deep(.el-button__icon) {
    color: var(--el-color-danger) !important;
  }
</style>
