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
          <h4 style="margin: 0;">库存信息</h4>
          <el-table
            :data="props.row.skuList"
            style="width: 100%"
          >
            <el-table-column
              prop="SkuName"
              label="库存名"
            />
            <el-table-column
              prop="Brand"
              label="品牌"
            />
            <el-table-column
              prop="Alarm"
              label="警报值"
            />
            <el-table-column
              label="配件/工具"
            >
              <template slot-scope="scope">
                {{ scope.row.Tool === 0 ? "配件" : "工具" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="Description"
              label="备注"
            />
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
              label="总金额"
            >
              <template slot-scope="scope">
                {{ scope.row.Price * scope.row.TotalCount | toMoney }}
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
            <template v-else-if="col.model === 'OutDate'">
              {{ scope.row.OutDate | formatDate('yyyy-MM-dd hh:mm:ss') }}
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
import { getOutList, delOut } from '@/api/system/out'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/OutModal'
export default {
  components: {
    EditModal
  },
  data() {
    return {
      column: [
        { label: '出库单号', model: 'OutNo' },
        { label: '操作员', model: 'Operator' },
        { label: '总金额', model: 'TotalPrice' },
        { label: '出库时间', model: 'OutDate' },
        { label: '批次', model: 'Batch' },
        { label: '客户编号', model: 'ClientId' },
        { label: '客户', model: 'ClientName' },
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
      getOutList(delEmpty({ PageIndex: this.currentPage, PageSize: this.size })).then(res => {
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
      this.$confirm('确认删除?(' + row.OutNo + ')')
        .then(() => {
          delOut({ Id: row.Id, EntryNo: row.OutNo }).then(() => {
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
