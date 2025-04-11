<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible.sync="crud.status.cu > 0"
    :title="crud.status.title"
    append-to-body
    width="730px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-form-item label="收件邮箱" prop="to">
        <el-input v-model="form.to" style="width: 220px" />
      </el-form-item>
      <el-form-item label="收件人名称" prop="toName">
        <el-input v-model="form.toName" style="width: 220px" />
      </el-form-item>
      <el-form-item label="抄送邮箱" prop="bccEmailAddresses">
        <el-input v-model="form.bccEmailAddresses" placeholder="多个邮箱都分号隔开" rows="4" style="width: 556px" />
      </el-form-item>
      <el-form-item label="发送邮箱" prop="emailAccounts">
        <el-select
          v-model="form.emailAccountId"
          style="width: 220px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in emailAccounts"
            :key="item.email"
            :label="item.email"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <el-date-picker
          v-model="form.sendTime"
          type="date"
          style="width: 220px"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="发送次数" prop="sentTries">
        <el-input v-model="form.sentTries" style="width: 220px" />
      </el-form-item>
      <el-form-item label="优先级" prop="sentTries">
        <el-input v-model="form.priority" style="width: 220px" />
      </el-form-item>
      <el-form-item label="标题" prop="sentTries">
        <el-input v-model="form.subject" style="width: 220px" />
      </el-form-item>
      <el-form-item label="邮件內容" prop="body">
        <el-input
          v-model="form.body"
          style="width: 556px"
          rows="4"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import { getAllEmailAccounts } from '@/api/message/emailAccount'
import CRUD from '../../components/Crud/crud'

const defaultForm = {
  id: 0,
  to: null,
  toName: null,
  priority: null,
  bcc: null,
  subject: null,
  body: null,
  sentTries: 0,
  sendTime: null,
  emailAccountId: null
}

export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      emailAccounts: [],
      rules: {
        to: [
          { required: true, message: '请输入邮件邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        body: [
          { required: true, message: '请输入邮件内容', trigger: 'blur' }
        ]
      }
    }
  }, mounted: function() {
    this.getEmailAccounts()
  }, methods: {
    // 获取可用的邮箱账号
    getEmailAccounts() {
      getAllEmailAccounts()
        .then((res) => {
          this.emailAccounts = res.content
        })
        .catch(() => {})
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.emailAccountId = Number(crud.form.emailAccountId)
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
