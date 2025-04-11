<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="600px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="68px"
    >
      <el-form-item
        label="租户Id"
        prop="tenantId"
      >
        <el-input
          v-model="form.tenantId"
          :disabled="isTenantIdDisabled"
          style="width: 192px"
          oninput="value=value.replace(/[^0-9]/g,'')"
        />
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
        />
      </el-form-item>
      <el-form-item label="类型" prop="tenantType">
        <el-select
          v-model="form.tenantType"
          placeholder="请选择"
          @change="handleTenantTypeChange"
        >
          <el-option
            v-for="item in dict.tenant_type"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="描述"
        prop="description"
      >
        <el-input
          v-model="form.description"
        />
      </el-form-item>
      <el-form-item label="DB类型" prop="dbType">
        <el-select
          v-model="form.dbType"
          placeholder="请选择"
          :disabled="isDbInfoDisabled"
        >
          <el-option
            v-for="item in dict.db_type"
            :key="item.value"
            :label="item.label"
            :value="parseInt(item.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="库标识"
        prop="configId"
      >
        <el-input
          v-model="form.configId"
          :disabled="isDbInfoDisabled"
        />
      </el-form-item>
      <el-form-item label="库连接" prop="connection">
        <el-input
          v-model="form.connection"
          :disabled="isDbInfoDisabled"
          style="width: 450px"
          rows="3"
          type="textarea"
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
import CRUD, { form } from '@crud/crud'

const defaultForm = {
  id: 0,
  tenantId: null,
  name: '',
  description: '',
  tenantType: 1,
  dbType: null,
  configId: '',
  connection: ''
}
export default {
  mixins: [form(defaultForm)],
  props: {
    dict: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rules: {
        tenantId: [
          { required: true, message: '请输入租户Id', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入租户名称', trigger: 'blur' }
        ],
        tenantType: [
          { required: true, message: '请选择租户类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isDbInfoDisabled() {
      return this.form.tenantType === 1
    },
    isTenantIdDisabled() {
      return this.form.id !== 0
    }
  },
  methods: {
    handleTenantTypeChange() {
      if (this.form.tenantType === 1) {
        this.form.dbType = null
        this.form.configId = ''
        this.form.connection = ''
      }
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.tenantType === 2) {
        if (crud.form.configId === '') {
          this.$message({
            message: '库标识不能为空',
            type: 'warning',
            center: true
          })
          return false
        }
        if (crud.form.connection === '') {
          this.$message({
            message: '库连接不能为空',
            type: 'warning',
            center: true
          })
          return false
        }
      }
      // crud.form.tenantType = Number(crud.form.tenantType)
      return true
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
