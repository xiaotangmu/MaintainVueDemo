<template>
  <div class="product-container">
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
import { getSpuList, delSpu } from '@/api/system/product'
import { delEmpty } from '@/utils/utils'
import SpuModal from './components/SpuModal'
export default {
  components: {
    SpuModal
  },
  data() {
    return {
      column: [
        { label: '产品名称', model: 'ProductName' },
        { label: '产品属性', model: 'SpuAttrModelList', align: 'left' },
        { label: '产品描述', model: 'Description' }
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
      getSpuList(delEmpty({ PageIndex: this.currentPage, PageSize: this.size })).then(res => {
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
          delSpu({ Id: row.Id, ProductName: row.ProductName }).then(() => {
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
.product-container {
  background-color: #fff;
  padding: 15px;
  border: solid 1px #ccc;
}
</style>
