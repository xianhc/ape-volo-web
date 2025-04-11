<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="应用ID"
        prop="appId"
      >
        <el-input
          v-model="form.appId"
          style="width: 370px;"
          placeholder="系统自动生成"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="应用密钥"
        prop="appSecretKey"
      >
        <el-input
          v-model="form.appSecretKey"
          style="width: 370px;"
          placeholder="系统自动生成"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="应用名称"
        prop="appName"
      >
        <el-input
          v-model="form.appName"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          style="width: 370px;"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'

const defaultForm = {
  id: 0,
  appId: '',
  appSecretKey: '',
  appName: '',
  remark: ''
}
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
