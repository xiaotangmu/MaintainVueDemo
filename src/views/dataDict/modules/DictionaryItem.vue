<template>
  <div>
    <el-drawer
      :modal="false"
      :visible.sync="drawer"
      :with-header="true"
      :modal-append-to-body="false"
      size="65%"
    >
      <h3 slot="title">字典项子项</h3>
      <div style="padding: 0px 20px;">
        <el-button type="primary" @click="handleNew">新增</el-button>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column
            align="center"
            label="字典項類型"
            prop="dataType"
          />
          <el-table-column
            align="center"
            width="300"
            label="字典项名称"
            prop="name"
          />
          <el-table-column
            align="center"
            label="描述"
            prop="description"
          />
          <el-table-column
            align="center"
            label="排序"
            prop="sort"
          />
          <el-table-column
            align="right"
            width="200px"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
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
          :modal-append-to-body="false"
          width="30%"
        >
          <span>{{ "确认删除(" + deleteName + ")" }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="deleteDic()">提交</el-button>
          </span>
        </el-dialog>
        <dic-item-modal
          ref="dicItemModal"
          @handleSuccess="getList"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import DicItemModal from './DictionaryItemModal'
import { del, getChildren } from '@/api/dataDict'
import { delEmpty } from '@/utils/utils'
export default {
  components: {
    DicItemModal
  },
  data() {
    return {
      drawer: false,
      size: 10,
      currentPage: 1,
      total: 100,
      loading: false,
      dialogVisible: false,
      deleteItem: '',
      deleteName: '',
      deleteItemType: '',
      deleteIndex: '',
      tableData: [],
      typeCode: '',
      dataType: ''
    }
  },
  methods: {
    getList() {
      getChildren(
        delEmpty({
          TypeCode: this.typeCode,
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
    visible(row) {
      this.typeCode = row.typeCode
      this.dataType = row.dataType
      this.drawer = true
      this.getList()
    },
    handleEdit(row) {
      this.$refs.dicItemModal.edit(row)
    },
    handleDelete(index, row) {
      this.dialogVisible = true
      this.deleteItem = row.code
      this.deleteName = row.name
      this.deleteItemType = row.id
      this.deleteIndex = index
    },
    deleteDic() {
      this.loading = true
      del({
        Id: this.deleteItemType,
        Code: this.deleteItem
      })
        .then(() => {
          this.loading = false
          this.dialogVisible = false
          this.tableData.splice(this.deleteIndex, 1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleNew() {
      this.$refs.dicItemModal.add(this.typeCode, this.dataType)
    }
  }
}
</script>
