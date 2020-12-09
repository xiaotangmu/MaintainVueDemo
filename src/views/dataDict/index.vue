<template>
  <div class="dictionary-container">
    <el-input
      v-model="name"
      placeholder="模糊查找"
      style="width: 200px; margin-right: 20px;"
    />
    <el-button
      type="primary"
      icon="el-icon-search"
      @click="getList()"
    />
    <el-button type="primary" icon="el-icon-plus" @click="handleNew()">新增</el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <template v-for="col in column">
        <el-table-column
          :key="col.model"
          align="center"
          :label="col.label"
          :prop="col.model"
          :sortable="col.model === 'sort'"
        >
          <template slot-scope="scope">
            <template>
              {{ scope.row[col.model] }}
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column align="center" width="280" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button type="danger" @click="handleDel(scope.row)">删除</el-button>
          <el-button type="success" @click="dicItem(scope.row)">
            子项
          </el-button>
        </template>
      </el-table-column>
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
    <el-dialog
      title="删除"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ "确认删除(" + deleteName + ")" }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="deleteDic()">
          确认
        </el-button>
      </span>
    </el-dialog>
    <dic-modal ref="dicModal" @handleSuccess="getList" />
    <dic-item ref="dicItem" />
  </div>
</template>

<script>
import DicItem from './modules/DictionaryItem'
import DicModal from './modules/DictionaryModal'
import { getPageList, del } from '@/api/dataDict'
import { delEmpty } from '@/utils/utils'
export default {
  components: {
    DicModal,
    DicItem
  },
  data() {
    return {
      column: [
        { model: 'typeCode', label: '类型编码' },
        { model: 'code', label: '字典项编码' },
        { model: 'name', label: '字典项名称' },
        { model: 'sort', label: '排序' },
        { model: 'description', label: '描述' }
      ],
      name: '',
      size: 10,
      currentPage: 1,
      total: 100,
      loading: false,
      dialogVisible: false,
      deleteItem: '',
      deleteItemType: '',
      deleteName: '',
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getPageList(
        delEmpty({
          IsLeaf: 0,
          SearchStr: this.name,
          PageIndex: this.currentPage,
          PageSize: this.size
        })
      ).then(res => {
        this.total = res.data.TotalCount
        this.tableData = res.data.Items.map(item => {
          return {
            id: item.Id,
            dataType: item.DataType,
            typeCode: item.TypeCode,
            code: item.Code,
            name: item.Text,
            isLeaf: item.IsLeaf,
            description: item.Description,
            sort: item.SortNum
          }
        })
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleEdit(row) {
      this.$refs.dicModal.edit(row)
    },
    handleDel(row) {
      this.dialogVisible = true
      this.deleteItem = row.code
      this.deleteName = row.name
      this.deleteItemType = row.id
    },
    handleNew() {
      this.$refs.dicModal.add()
    },
    dicItem(row) {
      this.$refs.dicItem.visible(row)
    },
    deleteDic() {
      del({
        Id: this.deleteItemType,
        Code: this.deleteItem
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dictionary-container {
  background-color: #fff;
  padding: 15px;
  border: solid 1px #ccc;
}
</style>
