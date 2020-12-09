<template>
  <div class="sku-container">
    <el-input v-model="search.SearchStr" placeholder="模糊查询" style="width: 300px;" />
    <el-date-picker
      v-model="search.StartTime"
      type="datetime"
      placeholder="选择开始时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      style="width: 300px;"
    />
    <el-date-picker
      v-model="search.EndTime"
      type="datetime"
      placeholder="选择结束时间"
      value-format="yyyy-MM-dd HH:mm:ss"
      style="width: 300px;"
    />
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
          <el-button @click="handleEdit(scope.$index, scope.row)">详情</el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand" label="备注">
        <template slot-scope="scope">
          {{ scope.row.Description }}
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
            <template v-if="col.model === 'TotalPrice'">
              {{ scope.row.TotalPrice | toMoney }}
            </template>
            <template v-if="col.model === 'OutNo'">
              <el-tag :type="scope.row.Status === 0 ? 'primary' :scope.row.Status === 1 ? 'warning': scope.row.Status === 2 ? 'success': 'danger'">
                {{ scope.row.Status === 0 ? "未绑定" :scope.row.Status === 1 ? "未完成": scope.row.Status === 2 ? "已完成": "坏件" }}
              </el-tag>
              {{ scope.row.OutNo }}
            </template>
            <template v-else-if="col.model === 'OutDate'">
              {{ scope.row.OutDate | formatDate('yyyy-MM-dd hh:mm:ss') }}
            </template>
            <template v-else-if="col.model === 'Status'">
              {{ scope.row.Status === 3 ? "坏件寄厂维修" : "普通出库" }}
            </template>
            <template v-else>
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
import { getOutList, delOut, delOutBatch } from '@/api/system/out'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/OutModal'
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
        EndTime: ''
      },
      column: [
        { label: '出库单号', model: 'OutNo' },
        { label: '操作员', model: 'Operator' },
        { label: '总金额', model: 'TotalPrice' },
        { label: '出库时间', model: 'OutDate' },
        { label: '批次', model: 'Batch' },
        { label: '客户', model: 'ClientName' },
        { label: '类型', model: 'Status' }

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
          delOutBatch(this.multipleSelection.map(i => {
            return {
              Id: i.Id,
              OutNo: i.OutNo
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
      getOutList(delEmpty({
        HasBad: -1,
        Status: -1,
        PageIndex: this.currentPage,
        PageSize: this.size,
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
      this.$refs.editModal.edit(row, row.Status)
    },
    handleDelete(index, row) {
      this.$confirm('确认删除?(' + row.OutNo + ')')
        .then(() => {
          delOut({ Id: row.Id, OutNo: row.OutNo }).then(() => {
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
