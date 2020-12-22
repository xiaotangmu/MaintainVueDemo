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
    <el-select v-model="search.Status" style="width: 150px;">
      <el-option :value="-1" :label="'全部'" />
      <el-option :value="1" :label="'已签字'" />
      <el-option :value="0" :label="'未签字'" />
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
          <el-button @click="handleEdit(scope.$index, scope.row)">详情</el-button>
          <el-button
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
      <!--
      <el-table-column type="expand" label="库存">
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
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Num + '(' + scope.row.Unit + ')' }}
                  </template>
                </el-table-column>
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
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                >
                  <template slot-scope="scope">
                    {{ scope.row.TotalCount + '(' + scope.row.Unit + ')' }}
                  </template>
                </el-table-column>
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
                  label="属性"
                >
                  <template slot-scope="scope">
                    <el-tag v-for="i in scope.row.AttrList.filter(i => i.AttrName)" :key="i.Id">
                      {{ i.AttrName }}
                      {{ i.Value }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                >
                  <template slot-scope="scope">
                    {{ scope.row.Num + '(' + scope.row.Unit + ')' }}
                  </template>
                </el-table-column>
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
      </el-table-column> -->

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
            <template v-else-if="col.model === 'Status'">
              <el-tag
                v-if="scope.row.Status === 1"
                type="success"
              >
                已签字
              </el-tag>
              <el-tag
                v-else
                type="primary"
                effect="plain"
              >
                维修中
              </el-tag>
            </template>
            <template v-else-if="col.model === 'StartDate'">
              {{ scope.row.StartDate}}
            </template>
            <template v-else-if="col.model === 'ReturnDate'">
              {{ scope.row.ReturnDate}}
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
import { getMaintainList, delMaintain, delMaintainBatch } from '@/api/system/maintain'
import { delEmpty } from '@/utils/utils'
import EditModal from './components/MaintainModal'
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
        Status: -1,
        ToolStatus: -1,
        OldPartStatus: -1
      },
      activeName: 'first',
      column: [
        { label: '维修单编号', model: 'MaintainNo' },
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
    deleteBatch() {
      this.$confirm('确认删除?')
        .then(() => {
          delMaintainBatch(this.multipleSelection.map(i => {
            return {
              Id: i.MaintainId,
              MaintainNo: i.MaintainNo
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
      getMaintainList(delEmpty({
        Status: this.search.Status,
        ToolStatus: -1,
        OldPartStatus: -1,
        SearchStr: this.search.SearchStr,
        StartTime: this.search.StartTime,
        EndTime: this.search.EndTime,
        PageIndex: this.currentPage,
        PageSize: this.size
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
      this.$confirm('确认删除?(' + row.MaintainNo	 + ')')
        .then(() => {
          delMaintain({ Id: row.MaintainId, MaintainNo: row.MaintainNo	 }).then(() => {
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
