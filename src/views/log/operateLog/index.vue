<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="操作人">
          <el-input v-model="searchInfo.createBy" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="searchInfo.method" clearable placeholder="请选择">
            <el-option
              v-for="item in httpMethodOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="请输入" />
        </el-form-item>
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div v-else class="p-1 rounded"></div>
    <div class="ape-volo-table">
      <el-table
        ref="tableRef"
        :data="data"
        v-loading="loading"
        @sort-change="onSortChange"
        row-key="id"
      >
        <el-table-column prop="createBy" label="账号" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column
          prop="executionDuration"
          label="请求耗时"
          sortable="custom"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.executionDuration <= 200" type="success"
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
        <el-table-column prop="description" label="描述" sortable="custom" />
        <el-table-column prop="method" label="请求方式" sortable="custom" />
        <el-table-column prop="requestIp" label="Ip地址" sortable="custom" />
        <el-table-column prop="ipAddress" label="归属地" sortable="custom" />
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
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
      <el-pagination v-bind="pagination" />
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
            <span class="text-emerald-500 min-w-[88px]">请求时间：</span
            ><span class="break-all">{{ currentRow.createTime }}</span>
            <span class="text-emerald-500 min-w-[88px]">请求地址：</span
            ><span class="break-all">{{ currentRow.requestUrl }}</span>
            <span class="text-emerald-500 min-w-[88px]">请求方式：</span
            ><span class="break-all">{{ currentRow.method }}</span>
            <span class="text-emerald-500 min-w-[88px]">Ip地址：</span
            ><span class="break-all">{{ currentRow.requestIp }}</span>
            <span class="text-emerald-500 min-w-[88px]">Ip归属地：</span
            ><span class="break-all">{{ currentRow.ipAddress }}</span>
            <span class="text-emerald-500 min-w-[88px]">耗时：</span
            ><span class="break-all">{{ currentRow.executionDuration }}</span>
            <span class="text-emerald-500 min-w-[88px]">操作系统：</span
            ><span class="break-all">{{ currentRow.operatingSystem }}</span>
            <span class="text-emerald-500 min-w-[88px]">设备类型：</span
            ><span class="break-all">{{ currentRow.deviceType }}</span>
            <span class="text-emerald-500 min-w-[88px]">浏览器：</span
            ><span class="break-all">{{ currentRow.browserName }}</span>
            <span class="text-emerald-500 min-w-[88px]">版本号：</span
            ><span class="break-all">{{ currentRow.version }}</span>
            <span class="text-emerald-500 min-w-[88px]">代理信息：</span
            ><span class="break-all">{{ currentRow.userAgent }}</span>
            <span class="text-emerald-500 min-w-[88px]">请求参数：</span>
            <pre class="break-all rounded">{{
              formatJson(currentRow.requestParameters)
            }}</pre>
            <span class="text-emerald-500 min-w-[88px]">响应结果：</span>
            <pre class="break-all rounded">{{
              formatJson(currentRow.responseData)
            }}</pre>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import { get } from '@/api/log/operateLog'
  import { ref } from 'vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'
  import { useAppStore } from '@/pinia'
  import { getDict } from '@/utils/dictionary'

  defineOptions({
    name: 'OperateLog'
  })

  const appStore = useAppStore()

  const operateDetailDrawer = ref(false)
  const currentRow = ref({})
  const tableRef = ref()
  const searchInfo = ref({})
  const httpMethodOption = ref([])

  const { data, searchToggle, loading, pagination, onSortChange } = useCrud({
    crudMethod: { list: get },
    defaultForm: () => ({}),
    searchInfo
  })

  getDict('http_method')
    .then((res) => {
      httpMethodOption.value = res
    })
    .catch((err) => {
      console.error('获取 http_method 失败:', err)
    })

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
</script>
