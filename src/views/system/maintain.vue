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
          <el-tabs v-model="activeName">
            <el-tab-pane label="旧配件表" name="first">
              <el-table
                :data="props.row.OldPartList"
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
                  prop="Num"
                  label="数量"
                />
                <el-table-column
                  prop="DealNum"
                  label="处理数量"
                />
                <el-table-column
                  prop="Remark"
                  label="备注"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="零件表" name="second">
              <el-table
                :data="props.row.SkuList"
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
                  prop="TotalCount"
                  label="数量"
                />
                <el-table-column
                  prop="DealNum"
                  label="处理数量"
                />
                <el-table-column
                  label="状态"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Status === 0 ? "新" : "旧" }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Remark"
                  label="备注"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="工具表" name="third">
              <el-table
                :data="props.row.ToolList"
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
                  prop="Num"
                  label="数量"
                />
                <el-table-column
                  prop="DealNum"
                  label="归还数量"
                />
                <el-table-column
                  label="赔偿金额"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Compensation | toMoney }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Status === 1 ? "新" : "旧" }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Remark"
                  label="备注"
                />
              </el-table>
            </el-tab-pane>
          </el-tabs>
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
            <template v-else-if="col.model === 'StartDate'">
              {{ scope.row.StartDate | formatDate('yyyy-MM-dd hh:mm:ss') }}
            </template>
            <template v-else-if="col.model === 'ReturnDate'">
              {{ scope.row.ReturnDate | formatDate('yyyy-MM-dd hh:mm:ss') }}
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
import { getMaintainList, delMaintain } from '@/api/system/maintain'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/MaintainModal'
export default {
  components: {
    EditModal
  },
  data() {
    return {
      activeName: 'first',
      column: [
        { label: '维修员工', model: 'Staff' },
        { label: '状态', model: 'Status' },
        { label: '创建时间', model: 'StartDate' },
        { label: '交付时间', model: 'ReturnDate' },
        { label: '负责人', model: 'Operator' }
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
      getMaintainList(delEmpty({ Status: -1, ToolStatus: -1, OldPartStatus: -1, PageIndex: this.currentPage, PageSize: this.size })).then(res => {
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
      this.$confirm('确认删除?(' + row.MaintainNo	 + ')')
        .then(() => {
          delMaintain({ Id: row.Id, MaintainNo: row.MaintainNo	 }).then(() => {
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
