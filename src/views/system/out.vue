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
              label="属性"
            >
              <template slot-scope="scope">
                <el-tag v-for="i in scope.row.AttrList" :key="i.Id">
                  {{ i.AttrName }}
                  {{ i.Value }}
                </el-tag>
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
      this.$refs.editModal.edit(row)
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
