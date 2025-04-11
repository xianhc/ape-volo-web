<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.jobName"
          clearable
          size="small"
          placeholder="输入任务名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--Form表单-->
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
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="form.email" style="width: 220px" />
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="form.displayName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="主机" prop="host">
          <el-input v-model="form.host" style="width: 220px" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" style="width: 220px" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" style="width: 220px" />
        </el-form-item>
        <el-form-item label="账户密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="是否SSL">
          <el-radio-group v-model="form.enableSsl" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否发送凭证">
          <el-radio-group
            v-model="form.useDefaultCredentials"
            style="width: 220px"
          >
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="账号ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮件地址"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="displayName"
        width="150px"
        label="显示名称"
      />
      <el-table-column :show-overflow-tooltip="true" prop="host" label="主机" />
      <el-table-column :show-overflow-tooltip="true" prop="port" label="端口" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="username"
        label="用户名"
      />
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="password"
        label="邮件密码"
      /> -->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="enableSsl"
        label="是否SSL"
      />
      <el-table-column
        width="110"
        :show-overflow-tooltip="true"
        prop="useDefaultCredentials"
        label="发送系统凭据"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="136px"
        label="创建时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateTime"
        width="136px"
        label="更新时间"
      />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['emailAccount_edit', 'emailAccount_del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudEmailAccount from '@/api/message/emailAccount'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: 0,
  email: null,
  displayName: null,
  host: null,
  port: null,
  username: null,
  password: null,
  enableSsl: false,
  useDefaultCredentials: false
}
export default {
  name: 'EmailAccount',
  components: {
    pagination,
    crudOperation,
    rrOperation,
    DateRangePicker,
    udOperation
  },
  cruds() {
    return CRUD({
      title: '电子邮件账户',
      url: 'api/email/account/query',
      crudMethod: { ...crudEmailAccount }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    const isNum = (rule, value, callback) => {
      const age = /^[0-9]*$/
      if (!age.test(value)) {
        callback(new Error('端口号只能为数字'))
      } else {
        callback()
      }
    }
    return {
      delLoading: false,
      permission: {
        add: ['emailAccount_add'],
        edit: ['emailAccount_edit'],
        del: ['emailAccount_del'],
        down: ['emailAccount_down']
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        displayName: [
          { required: true, message: '请输入邮箱显示名称', trigger: 'blur' }
        ],
        host: [{ required: true, message: '请输入主机', trigger: 'blur' }],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入邮箱用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入邮箱密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.port = Number(crud.form.port)
      return true
    }
  }
}
</script>
