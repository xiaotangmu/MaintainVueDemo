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
          <h4 style="margin: 0;">位置信息</h4>
          <el-table
            :data="props.row.addressList"
            style="width: 100%"
          >
            <el-table-column
              prop="Room"
              label="房间"
              width="180"
            />
            <el-table-column
              prop="Self"
              label="货架"
              width="180"
            />
            <el-table-column
              prop="Quantity"
              label="数量"
            />
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
            <template v-if="col.model === 'SpuAttrModelList'">
              <div v-for="i in scope.row.SpuAttrModelList" :key="i.Id" type="primary">
                {{ i.AttrName }}:
                <el-tag v-for="j in i.ValueList" :key="j.Id" type="primary">
                  {{ j.Value }}
                </el-tag>
              </div>
            </template>
            <template v-else-if="col.model === 'Tool'">
              {{ scope.row[col.model] === 0 ? "配件" : "工具" }}
            </template>
            <template v-else-if="col.model === 'Status'">
              {{ scope.row[col.model] === 0 ? "新" : "旧" }}
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
    <spu-modal ref="spuModal" @handleSuccess="getList" />
  </div>
</template>

<script>
import { getSkuList, delSku } from '@/api/system/sku'
import { delEmpty } from '@/utils/utils'
import SpuModal from './components/SkuModal'
export default {
  components: {
    SpuModal
  },
  data() {
    return {
      column: [
        { label: '库存名称', model: 'SkuName' },
        { label: '库存描述', model: 'Description' },
        { label: '警报值', model: 'Alarm' },
        { label: '品牌', model: 'Brand' },
        { label: '单价', model: 'Price' },
        { label: '数量', model: 'TotalCount' },
        { label: '配件/工具', model: 'Tool' },
        { label: '新旧', model: 'Status' }
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
      getSkuList(delEmpty({ PageIndex: this.currentPage, PageSize: this.size })).then(res => {
        this.tableData = res.data.Items
        this.total = res.data.TotalCount
      })
    },
    handleNew() {
      this.$refs.spuModal.add()
    },
    handleEdit(index, row) {
      this.$refs.spuModal.edit(row)
    },
    handleDelete(index, row) {
      this.$confirm('确认删除?(' + row.ProductName + ')')
        .then(() => {
          delSku({ Id: row.Id, ProductName: row.ProductName }).then(() => {
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
