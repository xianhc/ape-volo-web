<template>
  <el-form-item :label="label">
    <el-date-picker
      v-model="startDate"
      type="datetime"
      :placeholder="startPlaceholder"
      :disabled-date="disabledStartDate"
    />
    —
    <el-date-picker
      v-model="endDate"
      type="datetime"
      :placeholder="endPlaceholder"
      :disabled-date="disabledEndDate"
    />
  </el-form-item>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { formatTime } from '@/utils/dateTime'

  const props = defineProps({
    label: {
      type: String,
      default: '创建时间'
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    modelValue: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const startDate = ref(props.modelValue.startTime || null)
  const endDate = ref(props.modelValue.endTime || null)

  const disabledStartDate = (time) => {
    return endDate.value ? time.getTime() > endDate.value.getTime() : false
  }

  const disabledEndDate = (time) => {
    return startDate.value ? time.getTime() < startDate.value.getTime() : false
  }

  watch([startDate, endDate], ([newStart, newEnd]) => {
    emit('update:modelValue', {
      ...props.modelValue,
      startTime: formatTime(newStart),
      endTime: formatTime(newEnd)
    })
  })
</script>
