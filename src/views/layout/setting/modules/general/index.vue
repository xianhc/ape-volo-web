<template>
  <div class="ape-theme-font">
    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">设置维护</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <div class="space-y-5">
            <div class="ape-theme-card-white flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="general-action-icon general-action-icon--danger w-12 h-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 text-xl"
                >
                  <span class="i-mdi-restore text-2xl"></span>
                </div>
                <div>
                  <h4 class="text-sm font-semibold ape-theme-text-main">
                    恢复默认设置
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    将当前界面设置恢复为系统默认值
                  </p>
                </div>
              </div>
              <el-button
                type="danger"
                size="small"
                class="general-action-btn font-medium transition-all duration-150 ease-in-out hover:-translate-y-0.5"
                @click="handleResetConfig"
              >
                恢复默认
              </el-button>
            </div>

            <div class="ape-theme-card-white flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="general-action-icon general-action-icon--info w-12 h-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl"
                >
                  <span class="i-mdi-file-export-outline text-2xl"></span>
                </div>
                <div>
                  <h4 class="text-sm font-semibold ape-theme-text-main">
                    导出设置备份
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    将当前设置导出为 JSON 备份文件
                  </p>
                </div>
              </div>
              <el-button
                type="primary"
                size="small"
                class="general-action-btn font-medium transition-all duration-150 ease-in-out hover:-translate-y-0.5"
                :style="{
                  backgroundColor: config.primaryColor,
                  borderColor: config.primaryColor
                }"
                @click="handleExportConfig"
              >
                导出备份
              </el-button>
            </div>

            <div class="ape-theme-card-white flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="general-action-icon general-action-icon--success w-12 h-12 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-center text-green-600 dark:text-green-400 text-xl"
                >
                  <span class="i-mdi-file-import-outline text-2xl"></span>
                </div>
                <div>
                  <h4 class="text-sm font-semibold ape-theme-text-main">
                    导入设置备份
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    从 JSON 文件恢复已保存的设置内容
                  </p>
                </div>
              </div>
              <el-upload
                :auto-upload="false"
                :show-file-list="false"
                accept=".json"
                @change="handleImportConfig"
              >
                <el-button
                  type="success"
                  size="small"
                  class="general-action-btn font-medium transition-all duration-150 ease-in-out hover:-translate-y-0.5"
                >
                  导入备份
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <div class="ape-theme-section-header">
        <div class="ape-theme-divider"></div>
        <span class="ape-theme-section-title">项目说明</span>
        <div class="ape-theme-divider"></div>
      </div>

      <div class="ape-theme-section-content">
        <div class="ape-theme-card-bg">
          <div class="flex items-start gap-5">
            <div
              class="general-project-logo w-16 h-16 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm"
            >
              <img
                :src="setting.appLogo"
                alt=""
                class="w-16 h-16 object-contain"
              />
            </div>
            <div class="flex-1">
              <h4 class="text-xl font-semibold ape-theme-text-main mb-3">
                {{ setting.appName }}
              </h4>
              <p class="text-sm ape-theme-text-sub mb-5 leading-relaxed">
                基于 .NET 8 与 Vue 3
                的企业后台管理解决方案，适用于权限控制、系统管理与通用业务中台场景。
              </p>
              <div class="flex items-center gap-3 text-sm">
                <a
                  href="https://github.com/xianhc/ape-volo-admin"
                  target="_blank"
                  class="font-medium transition-colors duration-150 hover:underline"
                  :style="{ color: config.primaryColor }"
                >
                  GitHub 仓库
                </a>
                <span class="text-gray-400 dark:text-gray-500">·</span>
                <a
                  href="https://gitee.com/xianhc/ape-volo-admin"
                  target="_blank"
                  class="font-medium transition-colors duration-150 hover:underline"
                  :style="{ color: config.primaryColor }"
                >
                  Gitee 仓库
                </a>
                <span class="text-gray-400 dark:text-gray-500">·</span>
                <a
                  href="https://www.apevolo.com/"
                  target="_blank"
                  class="font-medium transition-colors duration-150 hover:underline"
                  :style="{ color: config.primaryColor }"
                >
                  系统官网
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { UploadFile } from 'element-plus'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/pinia'
  import setting from '@/setting'

  defineOptions({
    name: 'GeneralSettings'
  })

  const appStore = useAppStore()
  const { config } = storeToRefs(appStore)

  const handleResetConfig = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要恢复默认设置吗？当前个性化配置将被清空，且此操作不可撤销。',
        '恢复默认设置',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      appStore.resetConfig()
      ElMessage.success('已恢复默认设置')
    } catch {
      // User cancelled
    }
  }

  const handleExportConfig = () => {
    const configData = JSON.stringify(config.value, null, 2)
    const blob = new Blob([configData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `ape-volo-admin-settings-${
      new Date().toISOString().split('T')[0]
    }.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('设置备份已导出')
  }

  const handleImportConfig = (file: UploadFile) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedConfig = JSON.parse(e.target!.result as string)

        Object.keys(importedConfig).forEach((key) => {
          if (key in config.value) {
            const configObj = config.value as Record<string, unknown>
            configObj[key] = importedConfig[key]
          }
        })

        ElMessage.success('设置备份已导入')
      } catch {
        ElMessage.error('备份文件格式不正确')
      }
    }
    reader.readAsText(file.raw!)
  }
</script>

<style scoped>
  .general-action-icon,
  .general-project-logo {
    border-radius: calc(var(--ape-volo-radius));
  }

  .general-action-btn {
    border-radius: calc(var(--ape-volo-radius));
  }
</style>
