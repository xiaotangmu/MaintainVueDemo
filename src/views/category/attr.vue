<template>
  <div style="padding: 20px; height: calc(100vh - 85px);">
    <el-container style="height: 100%;">
      <el-aside width="300px" style="margin-bottom: 0; padding: 15px;">
        <h4 style="margin: 0;">分类目录</h4>
        <el-tree
          :props="props"
          :load="loadNode"
          accordion
          lazy
          style="font-weight: bold;"
          @node-click="handleNodeClick"
        />
      </el-aside>
      <el-main>
        <el-button type="primary" @click="attrAdd">新增</el-button>
        <el-button v-if="multipleSelection.length" type="danger" @click="deleteBatch">删除选中</el-button>
        <el-table :data="attrList" style="width: 100%;margin-top:30px;" stripe @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column align="center" label="属性名称" width="220">
            <template slot-scope="scope">
              {{ scope.row.AttrName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <attr-modal ref="attrModal" @handleSuccess="opeModal" />
  </div>
</template>

<script>
import { getList, getListBy1 } from '@/api/category/catalog'
import { getAttrList, delAttr, delAttrBatch } from '@/api/category/attr'
import AttrModal from './components/AttrModal'
export default {
  components: {
    AttrModal
  },
  data() {
    return {
      props: {
        label: 'CatalogName',
        children: 'children',
        isLeaf: 'leaf'
      },
      attrList: [],
      multipleSelection: [],
      search: ''
    }
  },
  methods: {
    deleteBatch() {
      this.$confirm(`确认删除?`, { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(_ => {
          delAttrBatch(this.multipleSelection).then(() => {
            this.getList()
          })
        })
        .catch(_ => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleNodeClick(data) {
      if (data.leaf) {
        this.search = data.Id
        this.getList()
      }
    },
    getList() {
      getAttrList({ catalogId: this.search }).then(res => {
        this.attrList = res.data
      })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        getList().then(res => {
          resolve(res.data)
        })
      }
      if (node.level === 1) {
        getListBy1({ Catalog1Id: node.data.Id }).then(res => {
          resolve(res.data.map(i => {
            i.leaf = true
            return i
          }))
        })
      }
    },
    handleDelete(row, index) {
      this.$confirm(`确认删除${row.CatalogName}?`, { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(_ => {
          delAttr(row).then(() => {
            this.opeModal(row, 'delete', index)
          })
        })
        .catch(_ => {})
    },
    attrAdd() {
      this.$refs.attrModal.add()
    },
    handleEdit(row, index) {
      this.$refs.attrModal.edit(row, index)
    },
    opeModal(row, type, index) {
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      if (type === 'delete') {
        this.attrList.splice(index, 1)
      } else if (type === 'update') {
        this.attrList.splice(index, 1, row)
      } else {
        this.getList()
      }
    },
    load(tree, treeNode, resolve) {
      getListBy1({ Catalog1Id: tree.Id }).then(res => {
        resolve(res.data)
      })
    }

  }
}
</script>
