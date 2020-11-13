<template>
  <div class="sku-container">
    <el-input v-model="search.SearchStr" placeholder="模糊查询" style="width: 300px;" />
    <el-date-picker
      v-model="search.StartTime"
      type="datetime"
      placeholder="选择开始时间"
      style="width: 300px;"
    />
    <el-date-picker
      v-model="search.EndTime"
      type="datetime"
      placeholder="选择结束时间"
      style="width: 300px;"
    />
    <el-select v-model="search.Status" style="width: 150px;">
      <el-option :value="-1" :label="'全部'" />
      <el-option :value="1" :label="'未处理'" />
      <el-option :value="2" :label="'已处理'" />
      <el-option :value="3" :label="'维修取消'" />
    </el-select>
    <el-button type="primary" icon="el-icon-plus" @click="getList()">查询</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="handleNew()">新增</el-button>
    <el-button v-if="multipleSelection.length" type="danger" @click="deleteBatch()">删除选中</el-button>
    <el-table :data="tableData" style="width: 100%" stripe @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="left" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          备注: {{ props.row.Remark }}
        </template>
      </el-table-column>

      <template v-for="col in column">
        <el-table-column
          :key="col.model"
          :align="col.align || 'center'"
          :label="col.label"
          :prop="col.model"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row[col.model] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      style="text-align: center;margin-top: 20px;"
      background
      :total="total"
      :current-page.sync="currentPage"
      :page-sizes="[8, 10, 13, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="getList"
    />
    <edit-modal ref="editModal" @handleSuccess="getList" />
  </div>
</template>

<script>
import { getAppointmentList, delAppointment, delAppointmentBatch } from '@/api/system/appointment'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/AppointmentModal'
export default {
  components: {
    EditModal
  },
  data() {
    return {
      multipleSelection: [],
      search: {
        SearchStr: '',
        StartTime: '',
        EndTime: '',
        Status: -1
      },
      column: [
        { label: '所属公司', model: 'CompanyId' },
        { label: '车牌号码', model: 'CarLicense' },
        { label: '问题描述', model: 'Description' },
        { label: '预约时间', model: 'AppointmentDate' },
        { label: '车型', model: 'Type' },
        { label: '联系人', model: 'Contact' },
        { label: '联系电话', model: 'Phone' },
        { label: '状态', model: 'Status' }
      ],
      size: 10,
      currentPage: 1,
      total: 100,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deleteBatch() {
      this.$confirm('确认删除?')
        .then(() => {
          delAppointmentBatch(this.multipleSelection.map(i => {
            return {
              Id: i.Id,
              AppointmentNo: i.AppointmentNo
            }
          })).then(() => {
            this.success()
            this.getList()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    getList() {
      getAppointmentList(delEmpty({
        PageIndex: this.currentPage,
        PageSize: this.size,
        Status: this.search.Status,
        SearchStr: this.search.SearchStr,
        StartTime: this.search.StartTime,
        EndTime: this.search.EndTime
      })).then(res => {
        this.tableData = res.data.Items
        this.total = res.data.TotalCount
      })
    },
    handleNew() {
      this.$refs.editModal.add()
    },
    handleEdit(index, row) {
      this.$refs.editModal.edit(row)
    },
    handleDelete(index, row) {
      this.$confirm('确认删除?')
        .then(() => {
          delAppointment({ Id: row.Id, AppointmentNo: row.AppointmentNo }).then(() => {
            this.tableData.splice(index, 1)
            this.success()
          })
        })
        .catch(() => {})
    },
    success() {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sku-container {
  background-color: #fff;
  padding: 15px;
  border: solid 1px #ccc;
}
</style>
