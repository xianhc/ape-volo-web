<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="作业名称">
          <el-select
            v-model="searchInfo.taskName"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in allTaskData"
              :key="item.id"
              :label="item.taskName"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作业结果">
          <el-select v-model="searchInfo.status" clearable placeholder="请选择">
            <el-option label="成功" :value="true"></el-option>
            <el-option label="失败" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div v-else class="p-1 rounded"></div>
    <div class="ape-volo-table">
      <div class="ape-volo-btn-list">
        <el-button
          v-has-role="['admin']"
          type="warning"
          icon="download"
          @click="doExport()"
        >
          导出
        </el-button>
      </div>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="data"
        row-key="id"
        @sort-change="onSortChange"
      >
        <el-table-column prop="createTime" label="作业时间" sortable="custom" />
        <el-table-column prop="taskGroup" label="任务组" sortable="custom" />
        <el-table-column prop="taskName" label="任务名称" sortable="custom" />
        <el-table-column prop="isSuccess" label="执行结果">
          <template #default="scope">
            <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">
              {{ scope.row.isSuccess ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="executionDuration"
          label="请求耗时"
          sortable="custom"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.executionDuration <= 200" type="success">
              {{ scope.row.executionDuration }}ms
            </el-tag>
            <el-tag v-else-if="scope.row.executionDuration <= 500">
              {{ scope.row.executionDuration }}ms
            </el-tag>
            <el-tag
              v-else-if="scope.row.executionDuration <= 1000"
              type="warning"
            >
              {{ scope.row.executionDuration }}ms
            </el-tag>
            <el-tag v-else type="danger">
              {{ scope.row.executionDuration }}ms
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :min-width="appStore.operateMinWith" label="操作">
          <template #default="scope">
            <el-button
              icon="view"
              type="text"
              @click="showTaskLogDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <el-drawer
      v-model="taskLogDetailDrawer"
      direction="rtl"
      :size="appStore.drawerSize"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg">{{ currentRow.taskName }}</span>
        </div>
      </template>
      <div class="p-2">
        <div class="ape-volo-bg rounded-lg shadow-mdp-3">
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
            <span class="text-emerald-500 min-w-[88px]">作业时间：</span
            ><span class="break-all">{{ currentRow.createTime }}</span>
            <span class="text-emerald-500 min-w-[88px]">任务组：</span
            ><span class="break-all">{{ currentRow.taskGroup }}</span>
            <span class="text-emerald-500 min-w-[88px]">任务名称：</span
            ><span class="break-all">{{ currentRow.taskName }}</span>
            <span class="text-emerald-500 min-w-[88px]">作业耗时：</span
            ><span class="break-all">{{ currentRow.executionDuration }}</span>
            <span class="text-emerald-500 min-w-[88px]">程序集：</span
            ><span class="break-all">{{ currentRow.assemblyName }}</span>
            <span class="text-emerald-500 min-w-[88px]">执行类：</span
            ><span class="break-all">{{ currentRow.className }}</span>
            <span class="text-emerald-500 min-w-[88px]">Cron：</span
            ><span class="break-all">{{ currentRow.cron }}</span>
            <span class="text-emerald-500 min-w-[88px]">参数：</span
            ><span class="break-all">{{ currentRow.runParams }}</span>
            <span class="text-emerald-500 min-w-[88px]">异常信息：</span
            ><span class="break-all">{{ currentRow.exceptionDetail }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { get, download } from '@/api/log/taskLog'
  import type {
    TaskLog,
    TaskLogQueryParams
  } from '@/api/log/types/taskLog.types'
  import { ref } from 'vue'
  import DateRangePicker from '@/components/Crud/DateRangePicker.vue'
  import { useCrud } from '@/components/Crud/UseCrud'
  import SearchOpts from '@/components/Crud/SearchOpts.vue'
  import { useAppStore } from '@/pinia'
  import { getAll, type Timing } from '@/api/system/timing'

  defineOptions({
    name: 'TaskLog'
  })

  const appStore = useAppStore()

  const taskLogDetailDrawer = ref(false)
  const currentRow = ref<TaskLog>({} as TaskLog)
  const searchInfo = ref<TaskLogQueryParams>({})
  const allTaskData = ref<Timing[]>([])

  const { data, searchToggle, loading, pagination, onSortChange, doExport } =
    useCrud({
      crudMethod: {
        list: get,
        add: () => Promise.resolve(),
        edit: () => Promise.resolve(),
        del: () => Promise.resolve(),
        download: download
      },
      defaultForm: () => ({}),
      searchInfo
    })

  const init = async () => {
    const res = await getAll()
    allTaskData.value = res.data
  }

  init()

  const showTaskLogDetail = (row: any) => {
    taskLogDetailDrawer.value = true
    currentRow.value = { ...row }
  }
</script>
