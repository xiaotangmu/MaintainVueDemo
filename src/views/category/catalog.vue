<template>
  <div style="padding: 20px;">
    <el-button type="primary" @click="menuAdd">新增</el-button>
    <el-table
      style="margin-top: 20px;"
      :data="tableData"
      stripe
      row-key="Id"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="left" prop="CatalogName" label="菜单名称" />
      <el-table-column
        align="center"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            @click="menuEdit(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            @click="menuDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <menu-modal ref="menuModal" @handleSuccess="opeModal" />
  </div>
</template>

<script>
import { getList, getListBy1, deleteCatalog1, deleteCatalog2 } from '@/api/category/catalog'
import MenuModal from './components/MenuModal'
export default {
  inject: ['reload'],
  components: {
    MenuModal
  },
  data() {
    return {
      loading: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    menuDelete(row) {
      this.$confirm(`确认删除${row.CatalogName}?`, { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(_ => {
          if (row.Catalog1Id) {
            deleteCatalog2({
              Id: row.Id,
              CatalogName: row.CatalogName,
              Catalog1Id: row.Catalog1Id
            }).then(() => {
              this.opeModal()
            })
          } else {
            deleteCatalog1({
              Id: row.Id,
              CatalogName: row.CatalogName
            }).then(() => {
              this.opeModal()
            })
          }
        })
        .catch(_ => {})
    },
    menuAdd() {
      this.$refs.menuModal.add()
    },
    menuEdit(row) {
      this.$refs.menuModal.edit(row)
    },
    opeModal() {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      this.reload()
    },
    getList() {
      this.loading = true
      getList().then(res => {
        this.tableData = res.data.map(i => {
          i.hasChildren = true
          return i
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    load(tree, treeNode, resolve) {
      getListBy1({ Catalog1Id: tree.Id }).then(res => {
        resolve(res.data)
      })
    }

  }
}
</script>
