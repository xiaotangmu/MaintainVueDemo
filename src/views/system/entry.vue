<template>
  <div class="sku-container">
    <el-input v-model="search.SearchStr" placeholder="模糊查询" style="width: 300px;" />
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
            <template v-if="col.model === 'Type'">
              {{ scope.row.Type === 0 ? '供应商' : scope.row.Type === 1 ? '维修单' : scope.row.Type === 2 ? '出库单坏件' : '维修完成回库' }}
            </template>
            <template v-else-if="col.model === 'EntryDate'">
              {{ scope.row.EntryDate | formatDate('yyyy-MM-dd hh:mm:ss') }}
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
import { getEntryList, delEntry, delEntryBatch } from '@/api/system/entry'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/EntryModal'
export default {
  components: {
    EditModal
  },
  data() {
    return {
      multipleSelection: [],
      search: {
        SearchStr: ''
      },
      column: [
        { label: '入库单号', model: 'EntryNo' },
        { label: '操作员', model: 'Operator' },
        { label: '总金额', model: 'TotalPrice' },
        { label: '入库时间', model: 'EntryDate' },
        { label: '批次', model: 'Batch' },
        { label: '来源', model: 'Type' }
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
          delEntryBatch(this.multipleSelection.map(i => {
            return {
              Id: i.Id,
              EntryNo: i.EntryNo
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
      getEntryList(delEmpty({ PageIndex: this.currentPage, PageSize: this.size, SearchStr: this.search.SearchStr })).then(res => {
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
      this.$confirm('确认删除?(' + row.EntryNo + ')')
        .then(() => {
          delEntry({ Id: row.Id, EntryNo: row.EntryNo }).then(() => {
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
