<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="文件描述">
          <el-input v-model="searchInfo.description" placeholder="请输入" />
        </el-form-item>
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div v-else class="p-1 rounded"></div>
    <div class="ape-volo-table">
      <CrudOpts :perms="perms">
        <template #left>
          <el-button type="primary" @click="uploadDialogVisible = true">
            <el-icon>
              <Upload />
            </el-icon>
            上传
          </el-button>
        </template>
      </CrudOpts>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="data"
        row-key="id"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" label="预览图" width="100">
          <template #default="scope">
            <el-image
              lazy
              :src="getBaseUrl() + scope.row.filePath"
              class="file"
              :preview-teleported="true"
              :preview-src-list="[getBaseUrl() + scope.row.filePath]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="文件描述" />
        <el-table-column
          prop="contentType"
          label="文件类型"
          sortable="custom"
        />
        <el-table-column
          prop="contentTypeName"
          label="文件类别"
          sortable="custom"
        />
        <el-table-column prop="size" label="文件大小" sortable="custom" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column
          :min-width="appStore.operateMinWith"
          align="center"
          label="操作"
        >
          <template #default="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>

    <!-- 弹窗，内部有 el-upload 和确认按钮 -->
    <el-dialog v-model="uploadDialogVisible" title="文件上传" width="600px">
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        :action="`${getBaseUrl()}/storage/upload`"
        :headers="headers"
        :show-file-list="true"
        :auto-upload="false"
        multiple
        class="upload-area"
        :before-upload="beforeUpload"
        :on-error="uploadError"
        :on-success="uploadSuccess"
      >
        <el-button type="primary">
          <el-icon>
            <Upload />
          </el-icon>
          选择文件
        </el-button>
      </el-upload>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="uploadLoading"
          :disabled="fileList.length === 0"
          @click="handleConfirmUpload"
        >
          确认上传
        </el-button>
      </template>
    </el-dialog>

    <!--表单渲染-->
    <el-dialog
      v-model="dialogVisible"
      :before-close="closeDialog"
      :show-close="false"
      title="编辑"
      width="600px"
    >
      <el-form
        ref="storageForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="文件描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSave">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { del, edit, get, add, download } from '@/api/system/storage'
  import type {
    Storage,
    StorageQueryParams
  } from '@/api/system/types/storage.types'
  import { ref } from 'vue'
  import type { UploadInstance, FormInstance } from 'element-plus'
  import DateRangePicker from '@/components/Crud/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/Crud/CrudOpts.vue'
  import RowOpts from '@/components/Crud/RowOpts.vue'
  import SearchOpts from '@/components/Crud/SearchOpts.vue'
  import { useAppStore } from '@/pinia'
  import { getBaseUrl } from '@/utils/index'
  import { Upload } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { getApeToken } from '@/utils/jwtAuth'

  defineOptions({
    name: 'Storage'
  })

  const perms = {
    add: ['sys:storage:add'],
    edit: ['sys:storage:edit'],
    del: ['sys:storage:del'],
    download: ['sys:storage:download']
  }

  const appStore = useAppStore()

  const searchInfo = ref<StorageQueryParams>({})

  const {
    data,
    refresh,
    searchToggle,
    loading,
    onSelectionChange,
    pagination,
    onSortChange,
    form,
    dialogVisible,
    closeDialog,
    validateAndSave
  } = useCrud({
    crudMethod: {
      list: get,
      del: del,
      add: (data: any) => add(data),
      edit: (data: any) => edit(data as Partial<Storage>),
      download: download
    },
    defaultForm: () => ({ description: '' }),
    searchInfo
  })

  var apeToken = getApeToken()
  const headers = ref({
    Authorization: apeToken.tokenType + ' ' + apeToken.accessToken
  })
  const uploadDialogVisible = ref(false)
  const uploadLoading = ref(false)
  const uploadRef = ref<UploadInstance | null>(null)
  const fileList = ref([])

  const handleConfirmUpload = () => {
    uploadLoading.value = true
    uploadRef.value?.submit()
  }

  const handleCancel = () => {
    uploadLoading.value = false
    uploadDialogVisible.value = false
    fileList.value = []
  }

  const beforeUpload = (file: File) => {
    let isTrue = true
    isTrue = file.size / 1024 / 1024 < 5
    if (!isTrue) {
      uploadLoading.value = false
      ElMessage.error('上传文件大小不能超过5MB!')
    }
    return isTrue
  }

  const uploadSuccess = () => {
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
    uploadLoading.value = false
    uploadDialogVisible.value = false
    fileList.value = []
    refresh()
  }

  const uploadError = (res: any, file: any) => {
    ElMessage.error(`…${res.message}: ${file.name}`)
    uploadLoading.value = false
  }

  const storageForm = ref<FormInstance | null>(null)
  const rules = ref({
    description: [
      { required: true, message: '请输入文件描述', trigger: 'blur' }
    ]
  })
  // 验证表单并保存
  const handleSave = () => validateAndSave(storageForm.value || undefined)
</script>
<style scoped>
  .file {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .upload-area {
    width: 100%;
    margin-bottom: 16px;
  }
</style>
