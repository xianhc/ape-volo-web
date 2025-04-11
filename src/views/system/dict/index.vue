<template>
  <div class="app-container">
    <!--表单组件-->
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
        <el-form-item label="字典类型" prop="dictType">
          <el-select
            v-model="form.dictType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dict.dict_type"
              :key="item.value"
              :label="item.label"
              :value="parseInt(item.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" style="width: 370px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >确认
        </el-button>
      </div>
    </el-dialog>
    <!-- 字典列表 -->
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
        :md="10"
        :lg="11"
        :xl="11"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <!--工具栏-->
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <!-- 搜索 -->
              <el-input
                v-model="query.keyWords"
                clearable
                size="small"
                placeholder="输入字典名称或者描述搜索"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
              <el-select v-model="query.dictType" clearable size="small" placeholder="字典类型" class="filter-item" style="width: 150px" @change="crud.toQuery">
                <el-option v-for="item in dict.dict_type" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <date-range-picker v-model="query.createTime" class="date-item" />
              <rrOperation />
            </div>
            <crudOperation :permission="permission" />
          </div>
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            highlight-current-row
            style="width: 100%"
            @selection-change="crud.selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" :selectable="checkboxT" width="55" />
            <el-table-column
              prop="dictType"
              :formatter="(row, column, cellValue) => getDictTypeText(cellValue)"
              label="字典类型"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="name"
              label="名称"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="description"
              label="描述"
            />
            <el-table-column
              v-if="checkPer(['admin', 'dict_edit', 'dict_del'])"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <udOperation :data="scope.row" :permission="permission" :disabled-edit="scope.row.id === 163519427764325" :disabled-dle="scope.row.id === 163519427764325" />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="13" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="
                checkPer(['dict_add']) &&
                  this.$refs.dictDetail &&
                  this.$refs.dictDetail.query.dictId
              "
              class="filter-item"
              size="mini"
              style="float: right; padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail && $refs.dictDetail.crud.toAdd()"
            >新增
            </el-button>
          </div>
          <dictDetail ref="dictDetail" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dictDetail from './dictDetail'
import crudDict from '@/api/system/dict'
import CRUD, { presenter, header, form } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker/index.vue'

const defaultForm = {
  id: 0,
  dictType: null,
  name: null,
  description: null,
  dictDetails: []
}

export default {
  name: 'Dict',
  components: {
    DateRangePicker,
    crudOperation,
    pagination,
    rrOperation,
    udOperation,
    dictDetail
  },
  cruds() {
    return [
      CRUD({
        title: '字典',
        url: 'api/dict/query',
        crudMethod: { ...crudDict }
      })
    ]
  },
  mixins: [presenter(), header(), form(defaultForm)],
  dicts: ['dict_type'],
  data() {
    return {
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'description', display_name: '描述' }
      ],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入字典描述', trigger: 'blur' }],
        dictType: [{ required: true, message: '请选择字典类型', trigger: 'blur' }]
      },
      permission: {
        add: ['dict_add'],
        edit: ['dict_edit'],
        del: ['dict_del'],
        down: ['dict_down']
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.query.dictId = 0
      }
      return true
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.query.dictId = val.id
        this.$refs.dictDetail.query.dictName = val.name
        this.$refs.dictDetail.dictId = val.id
        this.$refs.dictDetail.crud.toQuery()
      }
    },
    getDictTypeText(value) {
      try {
        const dictList = this.dict.dict_type
        const keys = Object.keys(dictList)
        const foundKey = keys.find(key => dictList[key].value === value.toString())
        if (foundKey) {
          return dictList[foundKey].label
        }
        return value
      } catch (err) {
        return value
      }
    },
    checkboxT(row, rowIndex) {
      return row.id !== 163519427764325
    }
  }
}
</script>

<style scoped>
</style>
