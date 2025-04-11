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
        label="Apis组"
        prop="group"
      >
        <el-input
          v-model="form.group"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="描述"
        prop="description"
      >
        <el-input
          v-model="form.description"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="请求路径"
        prop="description"
      >
        <el-input
          v-model="form.url"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="请求方法"
        prop="method"
      >
        <el-select v-model="form.method" size="small" placeholder="请求方法" class="filter-item" style="width: 370px">
          <el-option
            v-for="item in httpMethods"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button type="text" @click="crud.cancelCU">
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
  group: '',
  description: '',
  url: '',
  method: ''
}
export default {
  mixins: [form(defaultForm)],
  data() {
    return {
      rules: {
        group: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入请求路径', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请输入请求方法', trigger: 'blur' }
        ]
      },
      httpMethods: [{
        value: 'GET',
        label: 'GET(查询)'
      }, {
        value: 'POST',
        label: 'POST(创建)'
      }, {
        value: 'PUT',
        label: 'PUT(更新)'
      }, {
        value: 'DELETE',
        label: 'DELETE(删除)'
      }]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
