<template>
  <el-drawer
    v-model="dialogVisible"
    :size="appStore.drawerSize"
    :before-close="closeDialog"
    :show-close="false"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <span class="text-lg">{{ getFormTitle() }}</span>
        <div>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="loading" @click="handleSave"
            >保存</el-button
          >
        </div>
      </div>
    </template>

    <el-form
      ref="timingForm"
      :model="form"
      :rules="dynamicRules"
      :validate-on-rule-change="false"
      :inline="true"
      label-width="120px"
      label-position="right"
      class="grid grid-cols-2"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="form.taskName" />
      </el-form-item>
      <el-form-item label="作业模式" prop="triggerType">
        <el-radio-group v-model="form.triggerType" @change="handleRadioChange">
          <el-radio
            border
            v-for="item in props.taskTriggerTypeOption"
            :key="item.id"
            :value="Number(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务组" prop="taskGroup">
        <el-input v-model="form.taskGroup" />
      </el-form-item>
      <el-form-item label="程序集" prop="assemblyName">
        <el-input v-model="form.assemblyName" />
      </el-form-item>
      <el-form-item label="执行类" prop="className">
        <el-input v-model="form.className" />
      </el-form-item>
      <el-form-item prop="cron">
        <template #label>
          <div>
            <span>cron表达式</span>
            <el-tooltip
              content="作业模式为cron时必填，符合“秒 分 时 日 月 周”格式的 Cron 表达式，如：0 0/1 * * * ?（每分钟执行一次）"
              placement="top"
              effect="light"
            >
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input v-model="form.cron" :disabled="form.triggerType === 0" />
      </el-form-item>
      <el-form-item prop="intervalSecond">
        <template #label>
          <div>
            <span>执行周期(秒)</span>
            <el-tooltip
              content="注：作业模式为simple时必填，表示每次执行间隔的秒数，如：60（每60秒执行一次）"
              placement="top"
              effect="light"
            >
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input
          v-model="form.intervalSecond"
          :disabled="form.triggerType === 1"
          oninput="value=value.replace(/[^0-9]/g,'')"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item prop="cycleRunTimes">
        <template #label>
          <div>
            <span>执行次数</span>
            <el-tooltip
              content="注：作业模式为simple时必填，表示作业执行的次数，如：10（共执行10次）"
              placement="top"
              effect="light"
            >
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <el-input
          v-model="form.cycleRunTimes"
          :disabled="form.triggerType === 1"
          oninput="value=value.replace(/[^0-9]/g,'')"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          style="width: 100%"
          v-model="form.startTime"
          type="datetime"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          style="width: 100%"
          v-model="form.endTime"
          type="datetime"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="enabled">
        <el-radio-group v-model="form.enabled">
          <el-radio
            border
            v-for="item in props.statusTypeOption"
            :key="item.id"
            :value="strToBool(item.value)"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="失败后暂停" prop="pauseAfterFailure">
        <el-radio-group v-model="form.pauseAfterFailure">
          <el-radio border :value="true">是</el-radio>
          <el-radio border :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务负责人" prop="principal">
        <el-input v-model="form.principal" />
      </el-form-item>
      <el-form-item label="告警邮箱" prop="alertEmail">
        <el-input v-model="form.alertEmail" placeholder="多个邮箱用逗号隔开" />
      </el-form-item>
      <el-form-item label="参数内容" prop="runParams" class="col-span-2">
        <el-input
          v-model="form.runParams"
          placeholder="请输入"
          rows="2"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description" class="col-span-2">
        <el-input
          v-model="form.description"
          placeholder="请输入"
          :rows="5"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script setup>
  import { ref, inject, computed } from 'vue'
  import { useAppStore } from '@/pinia'
  import { strToBool } from '@/utils/converter'
  import { QuestionFilled } from '@element-plus/icons-vue'

  const appStore = useAppStore()

  const props = defineProps({
    statusTypeOption: {
      type: Array,
      required: true
    },
    taskTriggerTypeOption: {
      type: Array,
      required: true
    }
  })

  const handleRadioChange = () => {
    if (form.value.triggerType === 1) {
      form.value.intervalSecond = null
      form.value.cycleRunTimes = null
    } else if (form.value.triggerType === 0) {
      form.value.cron = null
    }
  }

  // 注入crud
  const crud = inject('crud')
  const {
    form,
    dialogVisible,
    loading,
    closeDialog,
    validateAndSave,
    getFormTitle
  } = crud

  const timingForm = ref(null)
  const dynamicRules = computed(() => {
    const baseRules = {
      taskName: [
        { required: true, message: '请输入任务名称', trigger: 'blur' }
      ],
      triggerType: [
        { required: true, message: '请选择作业模式', trigger: 'blur' }
      ],
      taskGroup: [{ required: true, message: '请输入任务組', trigger: 'blur' }],
      assemblyName: [
        { required: true, message: '请输入程序集', trigger: 'blur' }
      ],
      className: [{ required: true, message: '请输入执行类', trigger: 'blur' }],
      principal: [
        { required: true, message: '请输入负责人名称', trigger: 'blur' }
      ],
      enabled: [{ required: true, message: '请选择', trigger: 'blur' }],
      pauseAfterFailure: [
        { required: true, message: '请选择', trigger: 'blur' }
      ]
    }
    if (form.value.triggerType === 1) {
      baseRules.cron = [
        { required: true, message: '请输入cron任务表达式', trigger: 'blur' }
      ]
    }
    if (form.value.triggerType === 2) {
      baseRules.intervalSecond = [
        { required: true, message: '请输入执行周期(秒)', trigger: 'blur' }
      ]
      baseRules.cycleRunTimes = [
        { required: true, message: '请输入执行次数', trigger: 'blur' }
      ]
    }

    return baseRules
  })
  // 验证表单并保存
  const handleSave = () => validateAndSave(timingForm.value)
</script>
