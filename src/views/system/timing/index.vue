<template>
  <div>
    <div v-if="searchToggle" class="ape-volo-search">
      <el-form :inline="true" :model="searchInfo">
        <el-form-item label="任务名称">
          <el-input v-model="searchInfo.taskName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="分组">
          <el-input v-model="searchInfo.taskGroup" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="searchInfo.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchInfo.enabled"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <DateRangePicker v-model="searchInfo" />
        <SearchOpts />
      </el-form>
    </div>
    <div v-else class="p-1 rounded"></div>
    <div class="ape-volo-table">
      <CrudOpts :perms="perms" />
      <el-table
        ref="tableRef"
        :data="data"
        v-loading="loading"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        row-key="id"
        :preserve-expanded-content="true"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <div class="expand-detail">
              <p style="margin: 6px 0; padding: 2px 12px">
                分组: {{ scope.row.taskGroup }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                程序集: {{ scope.row.assemblyName }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                执行类: {{ scope.row.className }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                执行间隔(秒): {{ scope.row.intervalSecond }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                执行参数: {{ scope.row.runParams }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                告警邮箱: {{ scope.row.alertEmail }}
              </p>
              <p style="margin: 6px 0; padding: 2px 12px">
                描述: {{ scope.row.description }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="taskName" label="任务名称" sortable="custom" />
        <el-table-column prop="principal" label="任务负责人" />
        <el-table-column
          prop="triggerType"
          :formatter="
            (row, column, cellValue) =>
              showDictLabel(taskTriggerTypeOption, cellValue)
          "
          label="类型"
          sortable="custom"
        />
        <el-table-column prop="corn" label="corn" />
        <el-table-column prop="runTimes" label="已执行次数" sortable="custom" />
        <el-table-column prop="enabled" label="DB状态" sortable="custom">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.enabled"
              inline-prompt
              :loading="loadingMap[scope.row.id]"
              :active-text="showDictLabel(statusTypeOption, 'true')"
              :inactive-text="showDictLabel(statusTypeOption, 'false')"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="triggerState"
          :formatter="
            (row, column, cellValue) =>
              showDictLabel(taskTriggerStateOption, cellValue)
          "
          label="RAM状态"
        />
        <el-table-column prop="createTime" label="开始时间" sortable="custom" />
        <el-table-column prop="createTime" label="结束时间" sortable="custom" />
        <el-table-column prop="createTime" label="创建时间" sortable="custom" />
        <el-table-column :min-width="120" label="操作">
          <template v-slot="scope">
            <RowOpts :row="scope.row" :val="scope.row.name" :perms="perms">
              <template #right>
                <el-button
                  v-show="scope.row.triggerState === 5"
                  v-has-role="'admin'"
                  icon="run"
                  type="text"
                  @click="runningTask(scope.row.id)"
                >
                  执行
                </el-button>
                <el-button
                  v-show="scope.row.triggerState === 0"
                  v-has-role="'admin'"
                  icon="pause"
                  type="text"
                  @click="pauseTask(scope.row)"
                >
                  暂停
                </el-button>
                <el-button
                  v-show="scope.row.triggerState === 1"
                  v-has-role="'admin'"
                  icon="resume"
                  type="text"
                  @click="resumeTask(scope.row.id)"
                >
                  恢复
                </el-button>
              </template>
            </RowOpts>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-bind="pagination" />
    </div>
    <!--表单渲染-->
    <formPanel
      :status-type-option="statusTypeOption"
      :task-trigger-type-option="taskTriggerTypeOption"
    />
  </div>
</template>

<script setup>
  import {
    del,
    edit,
    get,
    add,
    execution,
    pause,
    resume,
    download
  } from '@/api/system/timing'
  import { reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import formPanel from './module/formPanel.vue'
  import DateRangePicker from '@/components/CRUD/DateRangePicker.vue'
  import { getDict, showDictLabel } from '@/utils/dictionary'
  import { useCrud } from '@/components/Crud/UseCrud'
  import CrudOpts from '@/components/CRUD/CrudOpts.vue'
  import RowOpts from '@/components/CRUD/RowOpts.vue'
  import SearchOpts from '@/components/CRUD/SearchOpts.vue'

  defineOptions({
    name: 'Timing'
  })

  const perms = {
    add: ['sys:timing:add'],
    edit: ['sys:timing:edit'],
    del: ['sys:timing:del'],
    download: ['sys:timing:download']
  }

  const searchInfo = ref({})

  // 状态
  const statusTypeOption = ref([])
  // 作业触发器类型
  const taskTriggerTypeOption = ref([])
  // 作业触发器状态
  const taskTriggerStateOption = ref([])

  const {
    data,
    searchToggle,
    loading,
    onSelectionChange,
    pagination,
    onSortChange,
    refresh
  } = useCrud({
    crudMethod: {
      list: get,
      del: del,
      add: add,
      edit: edit,
      download: download
    },
    defaultForm: () => ({
      id: 0,
      taskGroup: null,
      assemblyName: null,
      taskName: null,
      description: null,
      className: null,
      cron: null,
      principal: null,
      alertEmail: null,
      startTime: null,
      endTime: null,
      triggerType: 1,
      pauseAfterFailure: false,
      enabled: true,
      runParams: null,
      intervalSecond: null,
      cycleRunTimes: null
    }),
    searchInfo
  })

  const init = async () => {
    statusTypeOption.value = await getDict('status_type')
    taskTriggerTypeOption.value = await getDict('task_trigger_type')
    taskTriggerStateOption.value = await getDict('task_trigger_state')
  }

  init()

  const loadingMap = reactive({})
  const changeEnabled = async (row, val) => {
    loadingMap[row.id] = true
    ElMessageBox.confirm(
      `你要将${row.taskName}的状态切换为【${val ? '启用' : '禁用'}】吗？`,
      '切换状态',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        await edit(row).then(() => {
          ElMessage({
            type: 'success',
            message: '修改成功'
          })
        })
        loadingMap[row.id] = false
      })
      .catch(() => {
        row.enabled = !row.enabled
        loadingMap[row.id] = false
      })
  }

  const runningTask = async (id) => {
    execution(id)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '运行成功'
        })
        refresh()
      })
      .catch(() => {})
  }

  const pauseTask = async (row) => {
    ElMessageBox.confirm(`你要将${row.taskName}的暂停吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        pause(row.id).then(() => {
          ElMessage({
            type: 'success',
            message: '暂停成功'
          })
          refresh()
        })
      })
      .catch(() => {})
  }

  const resumeTask = async (id) => {
    resume(id)
      .then(() => {
        ElMessage({
          type: 'success',
          message: '恢复成功'
        })
        refresh()
      })
      .catch(() => {})
  }
</script>
<style>
  .expand-detail {
    padding: 8px 16px;
  }

  .expand-detail p {
    margin: 8px 0;
    padding: 2px 8px;
    border-radius: 4px;
  }
</style>
