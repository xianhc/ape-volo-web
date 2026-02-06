<template>
  <div class="ape-volo-bg p-4 lg:p-6 h-[calc(100vh-180px)] overflow-y-scroll">
    <!-- 主要内容区 -->
    <div class="grid lg:grid-cols-12 md:grid-cols-1 gap-8">
      <!-- 左侧信息栏 -->
      <div class="lg:col-span-3">
        <div class="ape-volo-content rounded-xl p-6 mb-6 profile-card">
          <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <el-icon class="text-blue-500"><info-filled /></el-icon>
            基础信息
          </h2>
          <div class="space-y-4">
            <div class="flex justify-center mb-4">
              <el-upload
                ref="uploadRef"
                :action="`${getBaseUrl()}/user/update/avatar`"
                name="avatar"
                accept="image/*"
                :show-file-list="false"
                :auto-upload="false"
                :on-success="handleImageSuccess"
                :on-change="handleFileChange"
                :headers="headers"
              >
                <img
                  style="
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                  "
                  :src="getBaseUrl() + userStore.userInfo.headerImg"
                  title="点击上传头像"
                  class="avatar"
                  alt="用户头像"
                />
              </el-upload>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><user /></el-icon>
                <span class="font-medium">登录账号</span>
              </div>
              <span>{{ userStore.userInfo.userName }}</span>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><nick-name /></el-icon>
                <span class="font-medium">用户昵称</span>
              </div>
              <span>{{ userStore.userInfo.nickName }}</span>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><dept /></el-icon>
                <span class="font-medium">所属部门</span>
              </div>
              <span>{{ userStore.userInfo.dept.name }}</span>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><phone /></el-icon>
                <span class="font-medium">手机号码</span>
              </div>
              <span>{{ userStore.userInfo.phone }}</span>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><message /></el-icon>
                <span class="font-medium">用户邮箱</span>
              </div>
              <span>{{ userStore.userInfo.email }}</span>
            </div>
            <div
              class="flex items-center justify-between gap-1 lg:gap-3 text-gray-600 dark:text-gray-300"
            >
              <div class="flex items-center gap-1 lg:gap-3">
                <el-icon><lock /></el-icon>
                <span class="font-medium">安全设置</span>
              </div>
              <div class="flex gap-1 ml-auto">
                <el-button
                  link
                  type="primary"
                  @click="showUpdateEmailPanel = true"
                >
                  修改邮箱
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="showUpdatePassPanel = true"
                >
                  修改密码
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="lg:col-span-9">
        <div class="ape-volo-content rounded-xl p-6 profile-card">
          <el-tabs
            v-model="activeTab"
            @tab-click="onTabClick"
            class="custom-tabs"
          >
            <el-tab-pane name="profile">
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><Postcard /></el-icon>
                  用户资料
                </div>
              </template>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 py-6">
                <el-form
                  ref="form"
                  :model="userForm"
                  :rules="rulesForm"
                  label-width="65px"
                >
                  <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="userForm.nickName" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" />
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-radio-group v-model="userForm.genderCode">
                      <el-radio
                        border
                        v-for="item in genderOption"
                        :key="item.id"
                        :value="Number(item.value)"
                        >{{ item.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="">
                    <el-button
                      type="primary"
                      :loading="loading"
                      :disabled="!formChanged"
                      @click="handleSave"
                      >保存配置</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane name="record">
              <template #label>
                <div class="flex items-center gap-2">
                  <el-icon><operation /></el-icon>
                  行为记录
                </div>
              </template>
              <div class="py-6">
                <div class="ape-volo-table">
                  <el-table
                    :data="tableData"
                    v-loading="tableLoading"
                    style="width: 100%"
                    row-key="id"
                  >
                    <el-table-column prop="createTime" label="创建时间" />
                    <el-table-column prop="executionDuration" label="请求耗时">
                      <template v-slot="scope">
                        <el-tag
                          v-if="scope.row.executionDuration <= 200"
                          type="success"
                          >{{ scope.row.executionDuration }}ms
                        </el-tag>
                        <el-tag v-else-if="scope.row.executionDuration <= 500"
                          >{{ scope.row.executionDuration }}ms
                        </el-tag>
                        <el-tag
                          v-else-if="scope.row.executionDuration <= 1000"
                          type="warning"
                          >{{ scope.row.executionDuration }}ms
                        </el-tag>
                        <el-tag v-else type="danger"
                          >{{ scope.row.executionDuration }}ms
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="requestUrl" label="请求地址" />
                    <el-table-column prop="description" label="描述" />
                    <el-table-column prop="method" label="请求方式" />
                    <el-table-column prop="requestIp" label="Ip地址" />
                    <el-table-column prop="ipAddress" label="归属地" />
                    <el-table-column
                      :min-width="appStore.operateMinWith"
                      label="操作"
                    >
                      <template v-slot="scope">
                        <el-button
                          @click="showOperateLogDetail(scope.row)"
                          icon="view"
                          type="text"
                        >
                          详情
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="total"
                    layout="total, prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </div>
              <el-drawer
                v-model="operateDetailDrawer"
                direction="rtl"
                :size="appStore.drawerSize"
              >
                <template #header>
                  <div class="flex justify-between items-center">
                    <span class="text-lg">{{ currentRow.description }}</span>
                  </div>
                </template>
                <div class="p-2">
                  <div class="ape-volo-bg rounded-lg shadow-md p-3">
                    <div class="flex items-center mb-2">
                      <div class="flex gap-2">
                        <span
                          class="w-3.5 h-3.5 rounded-full inline-block border border-[#e0443e] bg-[#ff5f56] shadow"
                        ></span>
                        <span
                          class="w-3.5 h-3.5 rounded-full inline-block border border-[#dea123] bg-[#ffbd2e] shadow"
                        ></span>
                        <span
                          class="w-3.5 h-3.5 rounded-full inline-block border border-[#13a10e] bg-[#27c93f] shadow"
                        ></span>
                      </div>
                    </div>
                    <div
                      class="grid gap-y-2 gap-x-4"
                      style="grid-template-columns: 88px 1fr"
                    >
                      <span class="text-emerald-500 min-w-[88px]">操作人：</span
                      ><span class="break-all">{{ currentRow.createBy }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >请求时间：</span
                      ><span class="break-all">{{
                        currentRow.createTime
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >请求地址：</span
                      ><span class="break-all">{{
                        currentRow.requestUrl
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >请求方式：</span
                      ><span class="break-all">{{ currentRow.method }}</span>
                      <span class="text-emerald-500 min-w-[88px]">Ip地址：</span
                      ><span class="break-all">{{ currentRow.requestIp }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >Ip归属地：</span
                      ><span class="break-all">{{ currentRow.ipAddress }}</span>
                      <span class="text-emerald-500 min-w-[88px]">耗时：</span
                      ><span class="break-all">{{
                        currentRow.executionDuration
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >操作系统：</span
                      ><span class="break-all">{{
                        currentRow.operatingSystem
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >设备类型：</span
                      ><span class="break-all">{{
                        currentRow.deviceType
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]">浏览器：</span
                      ><span class="break-all">{{
                        currentRow.browserName
                      }}</span>
                      <span class="text-emerald-500 min-w-[88px]">版本号：</span
                      ><span class="break-all">{{ currentRow.version }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >代理信息：</span
                      ><span class="break-all">{{ currentRow.userAgent }}</span>
                      <span class="text-emerald-500 min-w-[88px]"
                        >请求参数：</span
                      >
                      <pre class="break-all rounded">{{
                        formatJson(currentRow.requestParameters)
                      }}</pre>
                      <span class="text-emerald-500 min-w-[88px]"
                        >响应结果：</span
                      >
                      <pre class="break-all rounded">{{
                        formatJson(currentRow.responseData)
                      }}</pre>
                    </div>
                  </div>
                </div>
              </el-drawer>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 修改密码对话框 -->
    <updatePassPanel v-model:showUpdatePassPanel="showUpdatePassPanel" />

    <!-- 修改邮箱对话框 -->
    <updateEmailPanel v-model:showUpdateEmailPanel="showUpdateEmailPanel" />

    <!-- 修改头像 -->
    <el-dialog
      v-model="dialogVisible"
      title="图片裁剪"
      width="1200px"
      append-to-body
      @close="dialogVisible = false"
      :close-on-click-modal="false"
      draggable
    >
      <div class="flex gap-[30px] h-[600px]">
        <!-- 左侧编辑区 -->
        <div class="flex flex-col flex-1">
          <div class="flex-1 bg-[#f8f8f8] rounded-lg overflow-hidden">
            <VueCropper
              ref="cropperRef"
              :img="imgSrc"
              outputType="jpeg"
              :autoCrop="true"
              :autoCropWidth="cropWidth"
              :autoCropHeight="cropHeight"
              :fixedBox="false"
              :fixed="fixedRatio"
              :fixedNumber="fixedNumber"
              :centerBox="true"
              :canMoveBox="true"
              :full="false"
              :maxImgSize="1200"
              :original="true"
              @realTime="handleRealTime"
            ></VueCropper>
          </div>

          <!-- 工具栏 -->
          <div
            class="mt-[20px] flex items-center p-[10px] bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
          >
            <el-button-group>
              <el-tooltip content="向左旋转">
                <el-button @click="rotate(-90)" :icon="RefreshLeft" />
              </el-tooltip>
              <el-tooltip content="向右旋转">
                <el-button @click="rotate(90)" :icon="RefreshRight" />
              </el-tooltip>
              <el-button :icon="Plus" @click="changeScale(1)"></el-button>
              <el-button :icon="Minus" @click="changeScale(-1)"></el-button>
            </el-button-group>

            <el-select
              v-model="currentRatio"
              placeholder="选择比例"
              class="w-32 ml-4"
              @change="onCurrentRatio"
            >
              <el-option
                v-for="(item, index) in ratioOptions"
                :key="index"
                :label="item.label"
                :value="index"
              />
            </el-select>
          </div>
        </div>

        <!-- 右侧预览区 -->
        <div class="w-[340px]">
          <div
            class="bg-white p-5 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
          >
            <div class="mb-[15px] text-gray-600">裁剪预览</div>
            <div
              class="bg-white p-5 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
              :style="{ width: previews.w + 'px', height: previews.h + 'px' }"
            >
              <div class="w-full h-full relative overflow-hidden">
                <img
                  :src="previews.url"
                  :style="previews.img"
                  alt=""
                  class="max-w-none absolute transition-all duration-300 ease-in-out image-render-pixelated origin-[0_0]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpload" :loading="uploading">
            {{ uploading ? '上传中...' : '上 传' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { reactive, ref, computed, getCurrentInstance } from 'vue'
  import { cloneDeep, isEqual } from 'lodash-es'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/pinia/modules/user'
  import { useAppStore } from '@/pinia'
  import { isvalidPhone } from '@/utils/validate'
  import { getDict } from '@/utils/dictionary'
  import { editUserCenter } from '@/api/permission/user'
  import { getCurrent } from '@/api/log/operateLog'
  import updatePassPanel from './module/updatePassPanel.vue'
  import updateEmailPanel from './module/updateEmailPanel.vue'
  import { getBaseUrl } from '@/utils/index'
  import { getApeToken } from '@/utils/jwtAuth'
  import {
    RefreshLeft,
    RefreshRight,
    Plus,
    Minus
  } from '@element-plus/icons-vue'
  import 'vue-cropper/dist/index.css'
  import { VueCropper } from 'vue-cropper'

  defineOptions({
    name: 'PersonalCenter'
  })
  const appStore = useAppStore()
  const userStore = useUserStore()
  // 声明并初始化 form 对象
  const userForm = reactive({
    nickName: userStore.userInfo.nickName,
    phone: userStore.userInfo.phone,
    genderCode: userStore.userInfo.genderCode
  })

  var apeToken = getApeToken()
  const headers = ref({
    Authorization: apeToken.tokenType + ' ' + apeToken.accessToken
  })

  const uploadRef = ref(null)
  // 响应式数据
  const dialogVisible = ref(false)
  const imgSrc = ref('')
  const cropperRef = ref(null)
  const { proxy } = getCurrentInstance()
  const previews = ref({})
  const uploading = ref(false)

  const activeTab = ref('profile')
  const showUpdatePassPanel = ref(false)
  const showUpdateEmailPanel = ref(false)
  const loading = ref(false)
  const tableLoading = ref(false)

  const pageIndex = ref(1)
  const total = ref(0)
  const pageSize = ref(10)
  const tableData = ref([])

  const operateDetailDrawer = ref(false)
  const currentRow = ref({})

  //字典
  const genderOption = ref([])

  const validPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }
  const rulesForm = {
    nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    phone: [{ required: true, trigger: 'blur', validator: validPhone }]
  }

  getDict('gender_code')
    .then((res) => {
      genderOption.value = res
    })
    .catch((err) => {
      console.error('获取 gender_code 失败:', err)
    })

  const originalForm = reactive(cloneDeep(userForm))
  const formChanged = computed(() => !isEqual(userForm, originalForm))
  const form = ref(null)
  const handleSave = async () => {
    loading.value = true
    form.value.validate(async (valid) => {
      if (valid) {
        try {
          await editUserCenter({
            nickName: userForm.nickName,
            genderCode: userForm.genderCode,
            phone: userForm.phone
          })
          userStore.ResetUserInfo({
            nickName: userForm.nickName,
            phone: userForm.phone,
            genderCode: userForm.genderCode
          })
          Object.assign(originalForm, cloneDeep(userForm))
          ElMessage.success('修改成功！')
        } catch {
          /* empty */
        } finally {
          loading.value = false
        }
      } else {
        loading.value = false
      }
    })
  }

  // 查询
  const getTableData = async () => {
    const res = await getCurrent({
      pageIndex: pageIndex.value,
      pageSize: pageSize.value
    })
    tableData.value = res.data.content
    total.value = res.data.totalElements
    tableLoading.value = false
  }

  const handleCurrentChange = (val) => {
    pageIndex.value = val
    void getTableData()
  }

  const onTabClick = (tab) => {
    if (tab.paneName === 'record') {
      tableLoading.value = true
      void getTableData()
    }
  }

  const showOperateLogDetail = (row) => {
    operateDetailDrawer.value = true
    currentRow.value = { ...row }
  }

  const formatJson = (value) => {
    if (!value) return ''
    try {
      const obj = typeof value === 'string' ? JSON.parse(value) : value
      return JSON.stringify(obj, null, 2)
    } catch (err) {
      return value
    }
  }

  // 缩放控制
  const changeScale = (value) => {
    proxy.$refs.cropperRef.changeScale(value)
  }

  // 比例预设
  const ratioOptions = ref([
    { label: '1:1', value: [1, 1] },
    { label: '16:9', value: [16, 9] },
    { label: '9:16', value: [9, 16] },
    { label: '4:3', value: [4, 3] },
    { label: '自由比例', value: [] }
  ])

  const fixedNumber = ref([1, 1])
  const cropWidth = ref(300)
  const cropHeight = ref(300)

  const fixedRatio = ref(false)
  const currentRatio = ref(4)
  const onCurrentRatio = () => {
    fixedNumber.value = ratioOptions.value[currentRatio.value].value
    switch (currentRatio.value) {
      case 0:
        cropWidth.value = 300
        cropHeight.value = 300
        fixedRatio.value = true
        break
      case 1:
        cropWidth.value = 300
        cropHeight.value = (300 * 9) / 16
        fixedRatio.value = true
        break
      case 2:
        cropWidth.value = (300 * 9) / 16
        cropHeight.value = 300
        fixedRatio.value = true
        break
      case 3:
        cropWidth.value = 300
        cropHeight.value = (300 * 3) / 4
        fixedRatio.value = true
        break
      default:
        cropWidth.value = 300
        cropHeight.value = 300
        fixedRatio.value = false
    }
  }

  // 文件处理
  const handleFileChange = (file) => {
    const isImage = file.raw.type.includes('image')
    if (!isImage) {
      ElMessage.error('请选择图片文件')
      return
    }

    if (file.raw.size / 1024 / 1024 > 8) {
      ElMessage.error('文件大小不能超过8MB!')
      return false
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imgSrc.value = e.target.result
      dialogVisible.value = true
    }
    reader.readAsDataURL(file.raw)
  }

  // 旋转控制
  const rotate = (degree) => {
    if (degree === -90) {
      proxy.$refs.cropperRef.rotateLeft()
    } else {
      proxy.$refs.cropperRef.rotateRight()
    }
  }

  // 实时预览
  const handleRealTime = (data) => {
    previews.value = data
  }

  // 上传处理
  const handleUpload = () => {
    uploading.value = true
    proxy.$refs.cropperRef.getCropBlob((blob) => {
      try {
        const file = new File([blob], `${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        uploadRef.value.clearFiles()
        uploadRef.value.handleStart(file)
        uploadRef.value.submit()
      } catch (error) {
        uploading.value = false
        ElMessage.error('上传失败: ' + error.message)
      }
    })
  }

  const handleImageSuccess = (res) => {
    const closeDialog = () => {
      uploading.value = false
      dialogVisible.value = false
    }
    try {
      if (res.status === 201) {
        setTimeout(() => {
          closeDialog()
          previews.value = {}
          ElMessage.success(res.message || '头像上传成功')
        }, 1000)
      } else {
        closeDialog()
        ElMessage.error(res.message || '头像上传失败')
      }
    } catch (error) {
      closeDialog()
      ElMessage.error('头像上传处理异常: ' + error.message)
    }
  }
</script>

<style scoped>
  :deep(.vue-cropper) {
    background: transparent;
  }
</style>
