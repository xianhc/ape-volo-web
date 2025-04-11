<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="模板ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="from"
        label="发件邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="foName"
        label="发件人名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="to"
        label="收件邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toName"
        label="收件人名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="emailAccountId"
        label="发送邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bcc"
        label="抄送"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="subject"
        label="标题"
      />
      <el-table-column prop="responseData" label="发送内容" width="80px;">
        <template #default="scope">
          <div>
            <el-popover placement="left-start" trigger="click">
              <div class="popover-box">
                <!--                <pre>{{ scope.row.body }}</pre>-->
                <pre v-html="scope.row.body" />
              </div>
              <template #reference>
                <i class="el-icon-view" style="cursor: pointer;font-size: 20px;" />
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sentTries"
        style="width: 20px"
        label="发送次数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendTime"
        label="发送时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="UpdateTime"
        label="更新时间"
      />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['queuedEmail_edit', 'queuedEmail_del'])"
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
    <!--Form表单-->
    <eForm />
  </div>
</template>

<script>
import crudQueuedEmail from '@/api/queued/queuedEmail'
import eHeader from './header'
import eForm from './form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'EmailQueued',
  components: {
    eHeader,
    eForm,
    pagination,
    crudOperation,
    udOperation
  },
  cruds: function() {
    return CRUD({
      title: '电子邮件队列',
      url: 'api/queued/email/query',
      crudMethod: { ...crudQueuedEmail },
      optShow: {
        add: true,
        edit: true,
        del: true,
        down: false,
        reset: true
      }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      permission: {
        add: ['queuedEmail_add'],
        edit: ['queuedEmail_edit'],
        del: ['queuedEmail_del']
      }
    }
  },
  methods: {
    checkboxT: function(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>
<style>
.popover-box {
  //background: #112435;
  //color: #f08047;
  height: 700px;
  width: 900px;
  overflow: auto;
  scrollbar-width: thin;

}
.popover-box::-webkit-scrollbar {
  display: none;
}
</style>
