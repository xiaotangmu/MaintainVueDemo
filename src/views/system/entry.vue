<template>
  <div class="sku-container">
    <el-button type="primary" icon="el-icon-plus" @click="handleNew()">新增</el-button>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column align="left" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          <h4 style="margin: 0;">入库信息</h4>
          <el-table
            :data="props.row.skuList"
            style="width: 100%"
          >
            <el-table-column
              label="总金额"
            >
              <template slot-scope="scope">
                {{ scope.row.Price * scope.row.TotalCount | toMoney }}
              </template>
            </el-table-column>
            <el-table-column
              label="单价"
            >
              <template slot-scope="scope">
                {{ scope.row.Price | toMoney }}
              </template>
            </el-table-column>
            <el-table-column
              prop="TotalCount"
              label="数量"
            />
            <el-table-column
              label="新旧"
            >
              <template slot-scope="scope">
                {{ scope.row.Status === 0 ? "新" : "旧" }}
              </template>
            </el-table-column>
          </el-table>
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
            <template v-else-if="col.model === 'IsMaintain'">
              <div v-if="scope.row.IsMaintain === 0">
                <el-popover trigger="hover" placement="top">
                  <p>供应商编号: {{ scope.row.SupplierId }}</p>
                  <p>供应商: {{ scope.row.SupplierName }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag>供应商</el-tag>
                  </div>
                </el-popover>
              </div>
              <div v-else>
                <el-popover trigger="hover" placement="top">
                  <p>公司名: {{ scope.row.maintainShowModel.CompanyName }}</p>
                  <p>车牌号: {{ scope.row.maintainShowModel.CarLicense }}</p>
                  <p>类型: {{ scope.row.maintainShowModel.Type }}</p>
                  <p>开始时间: {{ scope.row.maintainShowModel.StartDate | formatDate('yyyy-MM-dd hh:mm:ss') }}</p>
                  <p>归还时间: {{ scope.row.maintainShowModel.ReturnDate | formatDate('yyyy-MM-dd hh:mm:ss') }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag>维修单</el-tag>
                  </div>
                </el-popover>
              </div>
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
import { getEntryList, delEntry } from '@/api/system/entry'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/EntryModal'
export default {
  components: {
    EditModal
  },
  data() {
    return {
      column: [
        { label: '入库单号', model: 'EntryNo' },
        { label: '操作员', model: 'Operator' },
        { label: '总金额', model: 'TotalPrice' },
        { label: '入库时间', model: 'EntryDate' },
        { label: '批次', model: 'Batch' },
        { label: '来源', model: 'IsMaintain' },
        { label: '备注', model: 'Description' }
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
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    getList() {
      getEntryList(delEmpty({ PageIndex: this.currentPage, PageSize: this.size })).then(res => {
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
